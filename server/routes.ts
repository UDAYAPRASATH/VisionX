import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTestRunSchema, insertTestResultSchema, insertAiInsightSchema, insertVisualDiffSchema } from "@shared/schema";
import { z } from "zod";
import path from "path";
import { promises as fs } from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Dashboard stats endpoint
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Test runs endpoints
  app.get("/api/test-runs", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const testRuns = await storage.getTestRuns(limit, offset);
      res.json(testRuns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test runs" });
    }
  });

  app.get("/api/test-runs/:runId", async (req, res) => {
    try {
      const testRun = await storage.getTestRun(req.params.runId);
      if (!testRun) {
        return res.status(404).json({ error: "Test run not found" });
      }
      res.json(testRun);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test run" });
    }
  });

  app.post("/api/test-runs", async (req, res) => {
    try {
      const validatedData = insertTestRunSchema.parse(req.body);
      const testRun = await storage.createTestRun(validatedData);
      res.status(201).json(testRun);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create test run" });
    }
  });

  app.patch("/api/test-runs/:runId", async (req, res) => {
    try {
      const testRun = await storage.updateTestRun(req.params.runId, req.body);
      if (!testRun) {
        return res.status(404).json({ error: "Test run not found" });
      }
      res.json(testRun);
    } catch (error) {
      res.status(500).json({ error: "Failed to update test run" });
    }
  });

  // Test results endpoints
  app.get("/api/test-runs/:runId/results", async (req, res) => {
    try {
      const testResults = await storage.getTestResults(req.params.runId);
      res.json(testResults);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test results" });
    }
  });

  app.get("/api/test-results/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testResult = await storage.getTestResult(id);
      if (!testResult) {
        return res.status(404).json({ error: "Test result not found" });
      }
      res.json(testResult);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test result" });
    }
  });

  app.post("/api/test-results", async (req, res) => {
    try {
      const validatedData = insertTestResultSchema.parse(req.body);
      const testResult = await storage.createTestResult(validatedData);
      res.status(201).json(testResult);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create test result" });
    }
  });

  app.get("/api/test-results/failed", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const failedResults = await storage.getFailedTestResults(limit);
      res.json(failedResults);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch failed test results" });
    }
  });

  // Visual diffs endpoints
  app.get("/api/test-results/:id/diffs", async (req, res) => {
    try {
      const testResultId = parseInt(req.params.id);
      const visualDiffs = await storage.getVisualDiffs(testResultId);
      res.json(visualDiffs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch visual diffs" });
    }
  });

  app.post("/api/visual-diffs", async (req, res) => {
    try {
      const validatedData = insertVisualDiffSchema.parse(req.body);
      const visualDiff = await storage.createVisualDiff(validatedData);
      res.status(201).json(visualDiff);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create visual diff" });
    }
  });

  app.patch("/api/visual-diffs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, acceptedBy } = req.body;
      
      const updates: any = { status };
      if (acceptedBy) updates.acceptedBy = acceptedBy;
      
      const visualDiff = await storage.updateVisualDiff(id, updates);
      if (!visualDiff) {
        return res.status(404).json({ error: "Visual diff not found" });
      }
      res.json(visualDiff);
    } catch (error) {
      res.status(500).json({ error: "Failed to update visual diff" });
    }
  });

  app.get("/api/visual-diffs/pending", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const pendingDiffs = await storage.getPendingVisualDiffs(limit);
      res.json(pendingDiffs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending visual diffs" });
    }
  });

  // AI insights endpoints
  app.get("/api/ai-insights", async (req, res) => {
    try {
      const testResultId = req.query.testResultId ? parseInt(req.query.testResultId as string) : undefined;
      const limit = parseInt(req.query.limit as string) || 10;
      const insights = await storage.getAiInsights(testResultId, limit);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI insights" });
    }
  });

  app.get("/api/ai-insights/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const insights = await storage.getRecentAiInsights(limit);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent AI insights" });
    }
  });

  app.post("/api/ai-insights", async (req, res) => {
    try {
      const validatedData = insertAiInsightSchema.parse(req.body);
      const aiInsight = await storage.createAiInsight(validatedData);
      res.status(201).json(aiInsight);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create AI insight" });
    }
  });

  // Screenshot serving endpoints
  app.get("/api/screenshots/:type/:filename", async (req, res) => {
    try {
      const { type, filename } = req.params;
      
      if (!["baseline", "actual", "diff"].includes(type)) {
        return res.status(400).json({ error: "Invalid screenshot type" });
      }

      const screenshotPath = path.join(process.cwd(), "screenshots", type, filename);
      
      try {
        await fs.access(screenshotPath);
        res.sendFile(screenshotPath);
      } catch {
        // If screenshot doesn't exist, return a placeholder or 404
        res.status(404).json({ error: "Screenshot not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to serve screenshot" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
