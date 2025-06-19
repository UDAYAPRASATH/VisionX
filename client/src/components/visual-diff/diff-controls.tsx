import { motion } from "framer-motion";
import { Check, X, Download, Share2, Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatPercentage } from "@/lib/utils";
import type { TestResult } from "@shared/schema";

interface DiffControlsProps {
  testResult: TestResult;
  onAccept: () => void;
  onReject: () => void;
  onFlag: () => void;
  isLoading?: boolean;
}

export function DiffControls({ testResult, onAccept, onReject, onFlag, isLoading }: DiffControlsProps) {
  const diffPercentage = testResult.percentageDifference ? testResult.percentageDifference / 100 : 0;
  
  const getSeverityBadge = () => {
    if (diffPercentage > 10) return <Badge variant="destructive">Critical</Badge>;
    if (diffPercentage > 5) return <Badge variant="secondary" className="bg-warning/10 text-warning">High</Badge>;
    if (diffPercentage > 1) return <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400">Medium</Badge>;
    return <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">Low</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Diff Statistics */}
      <Card className="visionx-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Pixel Difference</Label>
              <p className="text-lg font-semibold">
                {testResult.pixelDifference?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Percentage</Label>
              <p className="text-lg font-semibold">
                {formatPercentage(diffPercentage)}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Severity</Label>
              <div className="mt-1">
                {getSeverityBadge()}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Test Name</Label>
              <p className="text-lg font-semibold truncate" title={testResult.testName}>
                {testResult.testName}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Controls */}
      <Card className="visionx-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="review-notes" className="text-sm font-medium">
                Review Notes
              </Label>
              <Textarea
                id="review-notes"
                placeholder="Add notes about this visual difference..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={onAccept}
                    disabled={isLoading}
                    className="w-full bg-success hover:bg-success/90 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accept Changes
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={onReject}
                    disabled={isLoading}
                    variant="destructive"
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject Changes
                  </Button>
                </motion.div>
              </div>

              <div className="flex gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="icon" onClick={onFlag}>
                    <Flag className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
