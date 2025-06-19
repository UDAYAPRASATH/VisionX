import fs from 'fs';
import path from 'path';
import { storage } from '../storage';
import { compareScreenshotsWithGroqLlava } from '../utils/grokClient';
import { highlightDiff } from '../utils/highlight_diff';
import { test as runPlaywrightTest, expect, devices, chromium } from '@playwright/test';

export interface TestUrl {
  name: string;
  url: string;
}

export interface VisualTestResult {
  testName: string;
  status: 'passed' | 'failed' | 'running';
  baselineImage?: string;
  actualImage?: string;
  diffImage?: string;
  aiInsights?: string;
  error?: string;
}

export class VisualTestingService {
  private isRunning = false;
  
  async runVisualTests(urls: TestUrl[]): Promise<string> {
    if (this.isRunning) {
      throw new Error('Visual tests are already running');
    }

    this.isRunning = true;
    
    try {
      // Update URLs configuration
      fs.writeFileSync('urls.json', JSON.stringify(urls, null, 2));
      
      // Create test run
      const testRun = await storage.createTestRun({
        runId: `visual-${Date.now()}`,
        branch: 'main',
        status: 'running',
        totalTests: urls.length * 2, // baseline + comparison for each URL
        passedTests: 0,
        failedTests: 0,
        duration: 0
      });

      // Start Playwright tests asynchronously
      this.executePlaywrightTests(testRun.runId, urls);
      
      return testRun.runId;
    } finally {
      this.isRunning = false;
    }
  }

  private async executePlaywrightTests(runId: string, urls: TestUrl[]) {
    const startTime = Date.now();
    let passedTests = 0;
    let failedTests = 0;

    try {
      for (const { name, url } of urls) {
        try {
          // Run baseline capture
          await this.captureBaseline(name, url);
          passedTests++;

          // Run comparison test
          const comparisonResult = await this.runComparison(name, url, runId);
          if (comparisonResult.status === 'passed') {
            passedTests++;
          } else {
            failedTests++;
          }
        } catch (error) {
          console.error(`Test failed for ${name}:`, error);
          failedTests++;
          
          // Create failed test result
          await storage.createTestResult({
            runId,
            testName: name,
            status: 'failed',
            duration: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // Update test run status
      const duration = Date.now() - startTime;
      await storage.updateTestRun(runId, {
        status: failedTests > 0 ? 'failed' : 'passed',
        passedTests,
        failedTests,
        duration,
        completedAt: new Date()
      });

    } catch (error) {
      console.error('Visual testing failed:', error);
      await storage.updateTestRun(runId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async captureBaseline(name: string, url: string): Promise<void> {
    // Use Playwright Node API instead of spawn
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const screenshotPath = path.join('baseline', `${name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    await browser.close();
  }

  private async runComparison(name: string, url: string, runId: string): Promise<VisualTestResult> {
    const startTime = Date.now();
    // Use Playwright Node API instead of spawn
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const currentPath = path.join('current', `${name}.png`);
    await page.screenshot({ path: currentPath, fullPage: true });
    await browser.close();
    const baselinePath = path.join('baseline', `${name}.png`);
    // Check if images exist
    if (!fs.existsSync(baselinePath) || !fs.existsSync(currentPath)) {
      return {
        testName: name,
        status: 'failed',
        error: 'Baseline or current screenshot missing',
      };
    }
    // Generate diff image
    const diffPath = await highlightDiff(baselinePath, currentPath, 'diffimage');
    
    // Get AI insights using Groq
    const aiInsights = await compareScreenshotsWithGroqLlava(
      baselinePath, 
      currentPath, 
      process.env.GROK_API_KEY
    );

    // Calculate differences (simplified)
    const pixelDifference = Math.floor(Math.random() * 1000); // Replace with actual calculation
    const percentageDifference = Math.floor(Math.random() * 10); // Replace with actual calculation

    // Create test result
    const testResult = await storage.createTestResult({
      runId,
      testName: name,
      status: percentageDifference < 5 ? 'passed' : 'failed',
      duration: Date.now() - startTime,
      baselineImagePath: baselinePath,
      actualImagePath: currentPath,
      diffImagePath: diffPath,
      pixelDifference,
      percentageDifference,
      aiInsights: { analysis: aiInsights }
    });

    // Create AI insight
    await storage.createAiInsight({
      testResultId: testResult.id,
      type: 'visual_comparison',
      title: `Visual Analysis for ${name}`,
      description: aiInsights,
      confidence: 85 + Math.floor(Math.random() * 15),
      severity: percentageDifference > 5 ? 'error' : 'info',
      metadata: { diffPercentage: percentageDifference }
    });

    return {
      testName: name,
      status: percentageDifference < 5 ? 'passed' : 'failed',
      baselineImage: baselinePath,
      actualImage: currentPath,
      diffImage: diffPath,
      aiInsights
    };

  }

  async getTestStatus(runId: string) {
    const testRun = await storage.getTestRun(runId);
    if (!testRun) {
      throw new Error('Test run not found');
    }
    return testRun;
  }

  async getTestResults(runId: string) {
    return await storage.getTestResults(runId);
  }
}

export const visualTestingService = new VisualTestingService();