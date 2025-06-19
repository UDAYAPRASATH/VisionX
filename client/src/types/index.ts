export interface DashboardStats {
  totalTests: number;
  failedTests: number;
  successRate: number;
  avgDuration: number;
  trendsData: Array<{
    date: string;
    passed: number;
    failed: number;
  }>;
}

export interface TestDistribution {
  name: string;
  count: number;
  color: string;
  percentage: number;
}

export interface ComparisonMode {
  id: 'side-by-side' | 'slider' | 'overlay' | 'onion-skin';
  name: string;
  description: string;
}

export interface DiffRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ScreenshotComparison {
  baseline: string;
  actual: string;
  diff: string;
  regions?: DiffRegion[];
}
