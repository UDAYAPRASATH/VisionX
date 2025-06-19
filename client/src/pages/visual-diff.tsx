import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { ComparisonViewer } from "@/components/visual-diff/comparison-viewer";
import { DiffControls } from "@/components/visual-diff/diff-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { TestResult } from "@shared/schema";
import type { ScreenshotComparison, ComparisonMode } from "@/types";

export default function VisualDiff() {
  const { toast } = useToast();
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>({
    id: 'side-by-side',
    name: 'Side by Side',
    description: 'View baseline and actual side by side'
  });

  const { data: failedResults, isLoading } = useQuery<TestResult[]>({
    queryKey: ["/api/test-results/failed"],
  });

  const { data: currentResult } = useQuery<TestResult>({
    queryKey: ["/api/test-results", selectedResult],
    enabled: !!selectedResult,
  });

  const mockComparison: ScreenshotComparison = {
    baseline: "/api/screenshots/baseline/test.png",
    actual: "/api/screenshots/actual/test.png",
    diff: "/api/screenshots/diff/test.png",
    regions: [
      { x: 100, y: 150, width: 200, height: 50, severity: 'high' },
      { x: 50, y: 300, width: 150, height: 30, severity: 'medium' },
    ],
  };

  const handleAccept = () => {
    if (!currentResult) return;
    
    toast({
      title: "Changes Accepted",
      description: "The visual changes have been accepted and the baseline has been updated.",
    });
  };

  const handleReject = () => {
    if (!currentResult) return;
    
    toast({
      title: "Changes Rejected",
      description: "The visual changes have been rejected.",
      variant: "destructive",
    });
  };

  const handleFlag = () => {
    if (!currentResult) return;
    
    toast({
      title: "Test Flagged",
      description: "The test has been flagged for review.",
    });
  };

  return (
    <MainLayout
      title="Visual Diff"
      description="Compare and analyze visual differences"
    >
      <div className="space-y-6">
        {/* Test Selection */}
        <Card className="visionx-card">
          <CardHeader>
            <CardTitle>Select Test Result to Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedResult?.toString() || ""}
              onValueChange={(value) => setSelectedResult(parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a failed test to analyze..." />
              </SelectTrigger>
              <SelectContent>
                {failedResults?.map((result) => (
                  <SelectItem key={result.id} value={result.id.toString()}>
                    {result.testName} - {result.runId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {currentResult && (
          <>
            {/* Comparison Viewer */}
            <ComparisonViewer
              comparison={mockComparison}
              mode={comparisonMode}
              onModeChange={setComparisonMode}
            />

            {/* Diff Controls */}
            <DiffControls
              testResult={currentResult}
              onAccept={handleAccept}
              onReject={handleReject}
              onFlag={handleFlag}
            />
          </>
        )}

        {!currentResult && !isLoading && (
          <Card className="visionx-card">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Select a test result above to start comparing visual differences.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
