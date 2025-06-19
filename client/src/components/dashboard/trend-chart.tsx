import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DashboardStats } from "@/types";

interface TrendChartProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

export function TrendChart({ stats, isLoading }: TrendChartProps) {
  if (isLoading) {
    return (
      <Card className="visionx-card">
        <CardHeader>
          <div className="loading-shimmer h-6 w-32 rounded" />
        </CardHeader>
        <CardContent>
          <div className="loading-shimmer h-48 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  // Calculate max value for scaling
  const maxValue = Math.max(
    ...stats.trendsData.map(d => Math.max(d.passed, d.failed))
  );
  const scale = 180 / (maxValue || 1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="visionx-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Test Trends</CardTitle>
            <Select defaultValue="7days">
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="57" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 57 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Success line */}
              <motion.path
                d={`M${stats.trendsData.map((d, i) => 
                  `${20 + i * 54},${200 - d.passed * scale - 20}`
                ).join(' L')}`}
                fill="none"
                stroke="hsl(var(--success))"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              
              {/* Failed line */}
              <motion.path
                d={`M${stats.trendsData.map((d, i) => 
                  `${20 + i * 54},${200 - d.failed * scale - 20}`
                ).join(' L')}`}
                fill="none"
                stroke="hsl(var(--destructive))"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
              />
              
              {/* Data points */}
              {stats.trendsData.map((d, i) => (
                <g key={i}>
                  <motion.circle
                    cx={20 + i * 54}
                    cy={200 - d.passed * scale - 20}
                    r="4"
                    fill="hsl(var(--success))"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2 + i * 0.1 }}
                    whileHover={{ scale: 1.5 }}
                  />
                  <motion.circle
                    cx={20 + i * 54}
                    cy={200 - d.failed * scale - 20}
                    r="4"
                    fill="hsl(var(--destructive))"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2.5 + i * 0.1 }}
                    whileHover={{ scale: 1.5 }}
                  />
                </g>
              ))}
            </svg>
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground">Passed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <span className="text-sm text-muted-foreground">Failed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
