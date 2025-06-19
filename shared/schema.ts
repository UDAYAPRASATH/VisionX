import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("developer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const testRuns = pgTable("test_runs", {
  id: serial("id").primaryKey(),
  runId: text("run_id").notNull().unique(),
  branch: text("branch").notNull(),
  status: text("status").notNull(), // 'running', 'passed', 'failed', 'cancelled'
  totalTests: integer("total_tests").notNull(),
  passedTests: integer("passed_tests").notNull(),
  failedTests: integer("failed_tests").notNull(),
  duration: integer("duration"), // in seconds
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  metadata: jsonb("metadata"), // additional test run metadata
});

export const testResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  runId: text("run_id").notNull(),
  testName: text("test_name").notNull(),
  status: text("status").notNull(), // 'passed', 'failed', 'skipped'
  duration: integer("duration"), // in milliseconds
  baselineImagePath: text("baseline_image_path"),
  actualImagePath: text("actual_image_path"),
  diffImagePath: text("diff_image_path"),
  pixelDifference: integer("pixel_difference"),
  percentageDifference: integer("percentage_difference"), // stored as percentage * 100
  aiInsights: jsonb("ai_insights"), // AI-generated insights about the diff
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const visualDiffs = pgTable("visual_diffs", {
  id: serial("id").primaryKey(),
  testResultId: integer("test_result_id").notNull(),
  diffType: text("diff_type").notNull(), // 'layout', 'color', 'text', 'missing', 'extra'
  severity: text("severity").notNull(), // 'low', 'medium', 'high', 'critical'
  description: text("description").notNull(),
  coordinates: jsonb("coordinates"), // x, y, width, height of diff area
  suggestion: text("suggestion"), // AI-generated suggestion for fixing
  status: text("status").notNull().default("pending"), // 'pending', 'accepted', 'rejected'
  acceptedBy: integer("accepted_by"),
  acceptedAt: timestamp("accepted_at"),
});

export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  testResultId: integer("test_result_id").notNull(),
  type: text("type").notNull(), // 'position_shift', 'text_truncation', 'color_change', etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  confidence: integer("confidence").notNull(), // 0-100
  severity: text("severity").notNull(), // 'info', 'warning', 'error'
  metadata: jsonb("metadata"), // additional insight data
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertTestRunSchema = createInsertSchema(testRuns).omit({ id: true, startedAt: true });
export const insertTestResultSchema = createInsertSchema(testResults).omit({ id: true, createdAt: true });
export const insertVisualDiffSchema = createInsertSchema(visualDiffs).omit({ id: true, acceptedAt: true });
export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type TestRun = typeof testRuns.$inferSelect;
export type InsertTestRun = z.infer<typeof insertTestRunSchema>;
export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;
export type VisualDiff = typeof visualDiffs.$inferSelect;
export type InsertVisualDiff = z.infer<typeof insertVisualDiffSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
