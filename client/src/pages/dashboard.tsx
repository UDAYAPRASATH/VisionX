import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { TestDistribution } from "@/components/dashboard/test-distribution";
import { RecentTestRuns } from "@/components/dashboard/recent-test-runs";
import { VisualDiffPreview } from "@/components/dashboard/visual-diff-preview";
import { AiInsightsPanel } from "@/components/dashboard/ai-insights-panel";
import { useToast } from "@/hooks/use-toast";
import type { DashboardStats } from "@/types";
import type { TestRun, TestResult, AiInsight } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: testRuns, isLoading: runsLoading } = useQuery<TestRun[]>({
    queryKey: ["/api/test-runs"],
  });

  const { data: failedResults, isLoading: resultsLoading } = useQuery<TestResult[]>({
    queryKey: ["/api/test-results/failed"],
  });

  const { data: aiInsights, isLoading: insightsLoading } = useQuery<(AiInsight & { testResult: TestResult })[]>({
    queryKey: ["/api/ai-insights/recent"],
  });

  const handleRunTests = () => {
    toast({
      title: "Starting Test Run",
      description: "A new visual test run has been initiated.",
    });
  };

  const handleViewRun = (runId: string) => {
    window.open(`/test-runs/${runId}`, '_blank');
  };

  const handleViewDiff = (id: number) => {
    window.open(`/visual-diff/${id}`, '_blank');
  };

  const handleAcceptDiff = (id: number) => {
    toast({
      title: "Diff Accepted",
      description: "The visual difference has been accepted and baseline updated.",
    });
  };

  const handleRejectDiff = (id: number) => {
    toast({
      title: "Diff Rejected",
      description: "The visual difference has been rejected.",
      variant: "destructive",
    });
  };

  const handleViewInsight = (id: number) => {
    window.open(`/ai-insights/${id}`, '_blank');
  };

  return (
    <MainLayout
      title="Dashboard"
      description="Monitor your visual testing pipeline"
      onRunTests={handleRunTests}
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <StatsOverview 
          stats={stats || { totalTests: 0, failedTests: 0, successRate: 0, avgDuration: 0, trendsData: [] }} 
          isLoading={statsLoading} 
        />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendChart 
            stats={stats || { totalTests: 0, failedTests: 0, successRate: 0, avgDuration: 0, trendsData: [] }} 
            isLoading={statsLoading} 
          />
          <TestDistribution isLoading={statsLoading} />
        </div>

        {/* Recent Test Runs */}
        <RecentTestRuns
          testRuns={testRuns || []}
          isLoading={runsLoading}
          onViewRun={handleViewRun}
        />

        {/* Visual Diff Preview */}
        <VisualDiffPreview
          testResults={failedResults || []}
          isLoading={resultsLoading}
          onViewDiff={handleViewDiff}
          onAcceptDiff={handleAcceptDiff}
          onRejectDiff={handleRejectDiff}
        />

        {/* AI Insights Panel */}
        <AiInsightsPanel
          insights={aiInsights || []}
          isLoading={insightsLoading}
          onViewInsight={handleViewInsight}
        />
      </div>
    </MainLayout>
  );
}
