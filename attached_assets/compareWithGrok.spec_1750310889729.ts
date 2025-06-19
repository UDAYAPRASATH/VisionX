import 'dotenv/config';
import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { compareScreenshotsWithGroqLlava } from '../utils/grokClient';
import { highlightDiff } from '../utils/highlight_diff';

const urls = JSON.parse(fs.readFileSync('urls.json', 'utf-8'));
const GROK_API_KEY = process.env.GROK_API_KEY || 'your_api_key_here';
const promptPath = path.resolve('visual-prompt.txt');
const prompt = fs.readFileSync(promptPath, 'utf-8');

urls.forEach(({ name, url }) => {
  test.describe.serial(`${name} visual regression`, () => {
    test(`Capture baseline screenshot for ${name}`, async ({ page }) => {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const screenshotPath = path.join('baseline', `${name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Baseline screenshot saved: ${screenshotPath}`);
    });

    test(`Compare ${name} screenshot with baseline using Groq `, async ({ page }) => {
      test.setTimeout(120000);
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const currentPath = path.join('current', `${name}.png`);
      await page.screenshot({ path: currentPath, fullPage: true });
      const baselinePath = path.join('baseline', `${name}.png`);
      if (fs.existsSync(baselinePath)) {
        console.log('Calling Groq visual diff...');
        await compareScreenshotsWithGroqLlava(baselinePath, currentPath, GROK_API_KEY, prompt);
        console.log('Groq visual diff complete.');
        // Highlight pixel differences in red and save to diffimage
        await highlightDiff(baselinePath, currentPath, 'diffimage');
        console.log('Red diff image saved.');
      } else {
        console.error(`Baseline not found: ${baselinePath}`);
      }
    });
  });
});
