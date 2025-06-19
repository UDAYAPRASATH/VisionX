import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/utils";
import type { TestResult } from "@shared/schema";

interface VisualDiffPreviewProps {
  testResults: TestResult[];
  isLoading?: boolean;
  onViewDiff?: (id: number) => void;
  onAcceptDiff?: (id: number) => void;
  onRejectDiff?: (id: number) => void;
}

export function VisualDiffPreview({ 
  testResults, 
  isLoading, 
  onViewDiff, 
  onAcceptDiff, 
  onRejectDiff 
}: VisualDiffPreviewProps) {
  if (isLoading) {
    return (
      <Card className="visionx-card">
        <CardHeader>
          <div className="loading-shimmer h-6 w-40 rounded" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="loading-shimmer h-64 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getDiffBadgeText = (result: TestResult) => {
    if (result.status === 'passed') return 'No differences';
    if (result.pixelDifference && result.pixelDifference > 0) {
      return `${result.pixelDifference} differences`;
    }
    return 'Differences found';
  };

  const getDiffBadgeVariant = (result: TestResult) => {
    if (result.status === 'passed') return 'default';
    if (result.pixelDifference && result.pixelDifference > 1000) return 'destructive';
    return 'secondary';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card className="visionx-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Visual Diffs</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              View all diffs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-muted relative">
                  {/* Mock visual diff preview */}
                  <div className="absolute inset-0 flex">
                    <div className="flex-1 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800" />
                    <div className="flex-1 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800" />
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant={getDiffBadgeVariant(result)}>
                      {getDiffBadgeText(result)}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-medium text-sm">{result.testName}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(result.createdAt)}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDiff?.(result.id)}
                      className="text-xs text-primary"
                    >
                      View diff
                    </Button>
                    {result.status === 'failed' && (
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAcceptDiff?.(result.id)}
                          className="text-xs text-success hover:bg-success/10"
                        >
                          Accept
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRejectDiff?.(result.id)}
                          className="text-xs text-destructive hover:bg-destructive/10"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
