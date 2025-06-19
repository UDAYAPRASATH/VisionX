import { motion } from "framer-motion";
import { Activity, XCircle, CheckCircle, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDuration, formatPercentage } from "@/lib/utils";
import type { DashboardStats } from "@/types";

interface StatsOverviewProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

export function StatsOverview({ stats, isLoading }: StatsOverviewProps) {
  const statsCards = [
    {
      title: "Total Tests",
      value: stats.totalTests.toLocaleString(),
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10",
      trend: { value: "+12%", isPositive: true, label: "from last week" },
    },
    {
      title: "Failed Tests",
      value: stats.failedTests.toString(),
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      trend: { value: "-8%", isPositive: true, label: "from last week" },
    },
    {
      title: "Success Rate",
      value: formatPercentage(stats.successRate),
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
      trend: { value: "+2.1%", isPositive: true, label: "from last week" },
    },
    {
      title: "Avg Duration",
      value: formatDuration(Math.round(stats.avgDuration)),
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
      trend: { value: "-0.3s", isPositive: true, label: "faster than before" },
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="visionx-stat-card">
            <div className="loading-shimmer h-16 rounded-lg" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend.isPositive ? TrendingUp : TrendingDown;
        
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <Card className="visionx-stat-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <motion.div 
                    className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                    whileHover={{ rotate: 5 }}
                  >
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </motion.div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendIcon className={`w-4 h-4 ${stat.trend.isPositive ? 'text-success' : 'text-destructive'} mr-1`} />
                  <span className={stat.trend.isPositive ? 'text-success' : 'text-destructive'}>
                    {stat.trend.value}
                  </span>
                  <span className="text-muted-foreground ml-1">{stat.trend.label}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
