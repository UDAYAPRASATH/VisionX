import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { TestDistribution } from "@/types";

interface TestDistributionProps {
  isLoading?: boolean;
}

export function TestDistribution({ isLoading }: TestDistributionProps) {
  const distributionData: TestDistribution[] = [
    { name: "Login Flow", count: 342, color: "bg-success", percentage: 80 },
    { name: "Checkout Process", count: 298, color: "bg-primary", percentage: 60 },
    { name: "Dashboard UI", count: 187, color: "bg-warning", percentage: 40 },
    { name: "Mobile Views", count: 87, color: "bg-destructive", percentage: 20 },
  ];

  if (isLoading) {
    return (
      <Card className="visionx-card">
        <CardHeader>
          <div className="loading-shimmer h-6 w-32 rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="loading-shimmer h-8 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="visionx-card">
        <CardHeader>
          <CardTitle>Test Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {distributionData.map((item, index) => (
              <motion.div
                key={item.name}
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 ${item.color} rounded-sm`} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24">
                    <Progress 
                      value={item.percentage} 
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {item.count}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
