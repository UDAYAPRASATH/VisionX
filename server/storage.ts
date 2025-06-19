import { 
  users, testRuns, testResults, visualDiffs, aiInsights,
  type User, type InsertUser, type TestRun, type InsertTestRun,
  type TestResult, type InsertTestResult, type VisualDiff, type InsertVisualDiff,
  type AiInsight, type InsertAiInsight
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Test run operations
  getTestRuns(limit?: number, offset?: number): Promise<TestRun[]>;
  getTestRun(runId: string): Promise<TestRun | undefined>;
  createTestRun(testRun: InsertTestRun): Promise<TestRun>;
  updateTestRun(runId: string, updates: Partial<TestRun>): Promise<TestRun | undefined>;

  // Test result operations
  getTestResults(runId: string): Promise<TestResult[]>;
  getTestResult(id: number): Promise<TestResult | undefined>;
  createTestResult(testResult: InsertTestResult): Promise<TestResult>;
  getFailedTestResults(limit?: number): Promise<TestResult[]>;

  // Visual diff operations
  getVisualDiffs(testResultId: number): Promise<VisualDiff[]>;
  createVisualDiff(visualDiff: InsertVisualDiff): Promise<VisualDiff>;
  updateVisualDiff(id: number, updates: Partial<VisualDiff>): Promise<VisualDiff | undefined>;
  getPendingVisualDiffs(limit?: number): Promise<(VisualDiff & { testResult: TestResult })[]>;

  // AI insights operations
  getAiInsights(testResultId?: number, limit?: number): Promise<AiInsight[]>;
  createAiInsight(aiInsight: InsertAiInsight): Promise<AiInsight>;
  getRecentAiInsights(limit?: number): Promise<(AiInsight & { testResult: TestResult })[]>;

  // Dashboard statistics
  getDashboardStats(): Promise<{
    totalTests: number;
    failedTests: number;
    successRate: number;
    avgDuration: number;
    trendsData: Array<{ date: string; passed: number; failed: number }>;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private testRuns: Map<string, TestRun>;
  private testResults: Map<number, TestResult>;
  private visualDiffs: Map<number, VisualDiff>;
  private aiInsights: Map<number, AiInsight>;
  private currentUserId: number;
  private currentTestResultId: number;
  private currentVisualDiffId: number;
  private currentAiInsightId: number;

  constructor() {
    this.users = new Map();
    this.testRuns = new Map();
    this.testResults = new Map();
    this.visualDiffs = new Map();
    this.aiInsights = new Map();
    this.currentUserId = 1;
    this.currentTestResultId = 1;
    this.currentVisualDiffId = 1;
    this.currentAiInsightId = 1;

    // Initialize with sample data for development
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample user
    const user: User = {
      id: 1,
      username: "alexchen",
      password: "password",
      role: "developer",
      createdAt: new Date(),
    };
    this.users.set(1, user);

    // Create sample test runs
    const now = new Date();
    const testRun1: TestRun = {
      id: 1,
      runId: "#2847",
      branch: "main",
      status: "passed",
      totalTests: 147,
      passedTests: 147,
      failedTests: 0,
      duration: 154, // 2m 34s
      startedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      completedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000 + 154 * 1000),
      metadata: null,
      error: null
    };

    const testRun2: TestRun = {
      id: 2,
      runId: "#2846",
      branch: "feature/ui-update",
      status: "failed",
      totalTests: 147,
      passedTests: 132,
      failedTests: 15,
      duration: 118, // 1m 58s
      startedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
      completedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000 + 118 * 1000),
      metadata: null,
      error: null
    };

    const testRun3: TestRun = {
      id: 3,
      runId: "#2845",
      branch: "main",
      status: "running",
      totalTests: 147,
      passedTests: 89,
      failedTests: 0,
      duration: 83, // 1m 23s so far
      startedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
      completedAt: null,
      metadata: null,
      error: null
    };

    this.testRuns.set("#2847", testRun1);
    this.testRuns.set("#2846", testRun2);
    this.testRuns.set("#2845", testRun3);

    // Create sample test results with failures
    const failedResult1: TestResult = {
      id: 1,
      runId: "#2846",
      testName: "login-page-header",
      status: "failed",
      duration: 1200,
      baselineImagePath: "/screenshots/baseline/login-page-header.png",
      actualImagePath: "/screenshots/actual/login-page-header.png",
      diffImagePath: "/screenshots/diff/login-page-header.png",
      pixelDifference: 1247,
      percentageDifference: 312, // 3.12%
      aiInsights: null,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      error: null
    };

    const failedResult2: TestResult = {
      id: 2,
      runId: "#2846",
      testName: "checkout-button-styling",
      status: "failed",
      duration: 980,
      baselineImagePath: "/screenshots/baseline/checkout-button.png",
      actualImagePath: "/screenshots/actual/checkout-button.png",
      diffImagePath: "/screenshots/diff/checkout-button.png",
      pixelDifference: 445,
      percentageDifference: 89, // 0.89%
      aiInsights: null,
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      error: null
    };

    this.testResults.set(1, failedResult1);
    this.testResults.set(2, failedResult2);

    // Create sample AI insights
    const insight1: AiInsight = {
      id: 1,
      testResultId: 1,
      type: "position_shift",
      title: "Button Position Shift Detected",
      description: "The \"Sign Up\" button has shifted 8px to the right compared to the baseline. This might affect user interaction flow.",
      confidence: 94,
      severity: "warning",
      metadata: { shiftX: 8, shiftY: 0, element: "sign-up-button" },
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    };

    const insight2: AiInsight = {
      id: 2,
      testResultId: 2,
      type: "text_truncation",
      title: "Text Truncation Issue",
      description: "Product description text is being cut off in mobile view. The last 2 lines are not visible due to container height constraints.",
      confidence: 97,
      severity: "error",
      metadata: { truncatedLines: 2, containerHeight: "120px", requiredHeight: "156px" },
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    };

    const insight3: AiInsight = {
      id: 3,
      testResultId: 1,
      type: "improvement",
      title: "Improved Loading Animation",
      description: "The new loading spinner animation appears smoother and more consistent across different browser environments.",
      confidence: 89,
      severity: "info",
      metadata: { animationType: "spinner", improvement: "smoothness" },
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    };

    this.aiInsights.set(1, insight1);
    this.aiInsights.set(2, insight2);
    this.aiInsights.set(3, insight3);

    this.currentUserId = 2;
    this.currentTestResultId = 3;
    this.currentAiInsightId = 4;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      role: insertUser.role || "developer"
    };
    this.users.set(id, user);
    return user;
  }

  async getTestRuns(limit = 10, offset = 0): Promise<TestRun[]> {
    const runs = Array.from(this.testRuns.values())
      .sort((a, b) => (b.startedAt?.getTime() || 0) - (a.startedAt?.getTime() || 0))
      .slice(offset, offset + limit);
    return runs;
  }

  async getTestRun(runId: string): Promise<TestRun | undefined> {
    return this.testRuns.get(runId);
  }

  async createTestRun(insertTestRun: InsertTestRun): Promise<TestRun> {
    const testRun: TestRun = {
      ...insertTestRun,
      id: Array.from(this.testRuns.values()).length + 1,
      startedAt: new Date(),
      completedAt: null,
      duration: insertTestRun.duration || null,
      metadata: insertTestRun.metadata || null,
      error: insertTestRun.error || null,
    };
    this.testRuns.set(insertTestRun.runId, testRun);
    return testRun;
  }

  async updateTestRun(runId: string, updates: Partial<TestRun>): Promise<TestRun | undefined> {
    const testRun = this.testRuns.get(runId);
    if (!testRun) return undefined;

    const updated = { ...testRun, ...updates };
    this.testRuns.set(runId, updated);
    return updated;
  }

  async getTestResults(runId: string): Promise<TestResult[]> {
    return Array.from(this.testResults.values()).filter(result => result.runId === runId);
  }

  async getTestResult(id: number): Promise<TestResult | undefined> {
    return this.testResults.get(id);
  }

  async createTestResult(insertTestResult: InsertTestResult): Promise<TestResult> {
    const id = this.currentTestResultId++;
    const testResult: TestResult = {
      ...insertTestResult,
      id,
      createdAt: new Date(),
      duration: insertTestResult.duration || null,
      baselineImagePath: insertTestResult.baselineImagePath || null,
      actualImagePath: insertTestResult.actualImagePath || null,
      diffImagePath: insertTestResult.diffImagePath || null,
      pixelDifference: insertTestResult.pixelDifference || null,
      percentageDifference: insertTestResult.percentageDifference || null,
      aiInsights: insertTestResult.aiInsights || null,
      error: insertTestResult.error ?? null,
    };
    this.testResults.set(id, testResult);
    return testResult;
  }

  async getFailedTestResults(limit = 10): Promise<TestResult[]> {
    return Array.from(this.testResults.values())
      .filter(result => result.status === "failed")
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getVisualDiffs(testResultId: number): Promise<VisualDiff[]> {
    return Array.from(this.visualDiffs.values()).filter(diff => diff.testResultId === testResultId);
  }

  async createVisualDiff(insertVisualDiff: InsertVisualDiff): Promise<VisualDiff> {
    const id = this.currentVisualDiffId++;
    const visualDiff: VisualDiff = {
      ...insertVisualDiff,
      id,
      acceptedAt: null,
      status: insertVisualDiff.status || "pending",
      coordinates: insertVisualDiff.coordinates || null,
      suggestion: insertVisualDiff.suggestion || null,
      acceptedBy: insertVisualDiff.acceptedBy || null,
    };
    this.visualDiffs.set(id, visualDiff);
    return visualDiff;
  }

  async updateVisualDiff(id: number, updates: Partial<VisualDiff>): Promise<VisualDiff | undefined> {
    const visualDiff = this.visualDiffs.get(id);
    if (!visualDiff) return undefined;

    const updated = { ...visualDiff, ...updates };
    if (updates.status === "accepted" || updates.status === "rejected") {
      updated.acceptedAt = new Date();
    }
    this.visualDiffs.set(id, updated);
    return updated;
  }

  async getPendingVisualDiffs(limit = 10): Promise<(VisualDiff & { testResult: TestResult })[]> {
    const pending = Array.from(this.visualDiffs.values())
      .filter(diff => diff.status === "pending")
      .slice(0, limit);

    return pending.map(diff => {
      const testResult = this.testResults.get(diff.testResultId);
      return { ...diff, testResult: testResult! };
    });
  }

  async getAiInsights(testResultId?: number, limit = 10): Promise<AiInsight[]> {
    let insights = Array.from(this.aiInsights.values());
    
    if (testResultId) {
      insights = insights.filter(insight => insight.testResultId === testResultId);
    }

    return insights
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createAiInsight(insertAiInsight: InsertAiInsight): Promise<AiInsight> {
    const id = this.currentAiInsightId++;
    const aiInsight: AiInsight = {
      ...insertAiInsight,
      id,
      createdAt: new Date(),
      metadata: insertAiInsight.metadata || null,
    };
    this.aiInsights.set(id, aiInsight);
    return aiInsight;
  }

  async getRecentAiInsights(limit = 10): Promise<(AiInsight & { testResult: TestResult })[]> {
    const insights = Array.from(this.aiInsights.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);

    return insights.map(insight => {
      const testResult = this.testResults.get(insight.testResultId);
      return { ...insight, testResult: testResult! };
    });
  }

  async getDashboardStats() {
    const runs = Array.from(this.testRuns.values());
    const completedRuns = runs.filter(run => run.status !== "running");
    
    const totalTests = completedRuns.reduce((sum, run) => sum + run.totalTests, 0);
    const failedTests = completedRuns.reduce((sum, run) => sum + run.failedTests, 0);
    const passedTests = completedRuns.reduce((sum, run) => sum + run.passedTests, 0);
    const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
    
    const totalDuration = completedRuns.reduce((sum, run) => sum + (run.duration || 0), 0);
    const avgDuration = completedRuns.length > 0 ? totalDuration / completedRuns.length : 0;

    // Generate trends data for the last 7 days
    const trendsData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate trend data
      const dayRuns = runs.filter(run => {
        if (!run.startedAt) return false;
        const runDate = run.startedAt instanceof Date ? run.startedAt : new Date(run.startedAt);
        return runDate.toDateString() === date.toDateString();
      });
      
      const passed = dayRuns.reduce((sum, run) => sum + run.passedTests, 0);
      const failed = dayRuns.reduce((sum, run) => sum + run.failedTests, 0);
      
      trendsData.push({
        date: date.toISOString().split('T')[0],
        passed: passed || Math.floor(Math.random() * 50) + 100, // Fallback data
        failed: failed || Math.floor(Math.random() * 10),
      });
    }

    return {
      totalTests,
      failedTests,
      successRate: Math.round(successRate * 100) / 100,
      avgDuration,
      trendsData,
    };
  }
}

export const storage = new MemStorage();
