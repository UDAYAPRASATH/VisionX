import { motion } from "framer-motion";
import { Cpu, AlertTriangle, XCircle, CheckCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSeverityColor, getSeverityIcon, formatTimeAgo } from "@/lib/utils";
import type { AiInsight, TestResult } from "@shared/schema";

interface AiInsightsPanelProps {
  insights: (AiInsight & { testResult: TestResult })[];
  isLoading?: boolean;
  onViewInsight?: (id: number) => void;
}

export function AiInsightsPanel({ insights, isLoading, onViewInsight }: AiInsightsPanelProps) {
  const getInsightIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircle className="w-3 h-3 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-warning" />;
      case 'info':
        return <CheckCircle className="w-3 h-3 text-success" />;
      default:
        return <Info className="w-3 h-3 text-primary" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="visionx-card">
        <CardHeader>
          <div className="loading-shimmer h-8 w-48 rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="loading-shimmer h-20 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card className="visionx-card">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <CardTitle>AI-Generated Insights</CardTitle>
            <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
              Beta
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 ${insight.severity === 'error' ? 'bg-destructive/10' : insight.severity === 'warning' ? 'bg-warning/10' : 'bg-success/10'} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    {getInsightIcon(insight.severity)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{insight.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {insight.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-muted-foreground">
                      <span>Confidence: {insight.confidence}%</span>
                      <span>Test: {insight.testResult.testName}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewInsight?.(insight.id)}
                        className="text-primary hover:text-primary/80 h-auto p-0"
                      >
                        View details →
                      </Button>
                    </div>
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
