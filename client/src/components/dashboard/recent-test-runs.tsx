import { motion } from "framer-motion";
import { Check, X, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDuration, formatTimeAgo, getStatusBadgeClass } from "@/lib/utils";
import type { TestRun } from "@shared/schema";

interface RecentTestRunsProps {
  testRuns: TestRun[];
  isLoading?: boolean;
  onViewRun?: (runId: string) => void;
}

export function RecentTestRuns({ testRuns, isLoading, onViewRun }: RecentTestRunsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <Check className="w-4 h-4 text-success" />;
      case 'failed':
        return <X className="w-4 h-4 text-destructive" />;
      case 'running':
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="visionx-card">
        <CardHeader>
          <div className="loading-shimmer h-6 w-40 rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="loading-shimmer h-16 rounded" />
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
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="visionx-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Test Runs</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              View all
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Run ID</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Tests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Started</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testRuns.map((run, index) => (
                <motion.tr
                  key={run.runId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                        {getStatusIcon(run.status)}
                      </div>
                      <span className="font-mono text-sm">{run.runId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {run.branch}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {run.passedTests} passed, {run.failedTests} failed
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(run.status)}>
                      {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {run.duration ? formatDuration(run.duration) : '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatTimeAgo(run.startedAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewRun?.(run.runId)}
                      className="h-8 w-8"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
