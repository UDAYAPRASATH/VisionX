import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Cpu, Brain, Zap, TrendingUp, AlertTriangle, XCircle, CheckCircle, Info, Filter, Search, Download } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatTimeAgo, getSeverityColor, getSeverityIcon } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { AiInsight, TestResult } from "@shared/schema";

export default function AiInsights() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedInsight, setSelectedInsight] = useState<number | null>(null);

  const { data: insights, isLoading } = useQuery<(AiInsight & { testResult: TestResult })[]>({
    queryKey: ["/api/ai-insights/recent", { limit: 50 }],
  });

  const { data: allInsights } = useQuery<AiInsight[]>({
    queryKey: ["/api/ai-insights", { limit: 100 }],
  });

  const filteredInsights = insights?.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.testResult.testName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || insight.severity === severityFilter;
    const matchesType = typeFilter === "all" || insight.type === typeFilter;
    
    return matchesSearch && matchesSeverity && matchesType;
  }) || [];

  const insightTypes = Array.from(new Set(insights?.map(insight => insight.type) || []));
  
  const severityStats = {
    error: insights?.filter(i => i.severity === 'error').length || 0,
    warning: insights?.filter(i => i.severity === 'warning').length || 0,
    info: insights?.filter(i => i.severity === 'info').length || 0,
  };

  const getInsightIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-success" />;
      default:
        return <Info className="w-4 h-4 text-primary" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'position_shift':
        return '📍';
      case 'text_truncation':
        return '✂️';
      case 'color_change':
        return '🎨';
      case 'layout_shift':
        return '📐';
      case 'improvement':
        return '✨';
      default:
        return '🔍';
    }
  };

  const handleExportInsights = () => {
    toast({
      title: "Exporting Insights",
      description: "AI insights report is being generated...",
    });
  };

  const handleRegenerateInsights = () => {
    toast({
      title: "Regenerating Insights",
      description: "AI is analyzing recent test results for new insights...",
    });
  };

  return (
    <MainLayout
      title="AI Insights"
      description="AI-powered visual issue detection and analysis"
    >
      <div className="space-y-6">
        {/* AI Insights Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="visionx-card bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AI-Powered Analysis</h2>
                    <p className="text-muted-foreground">Advanced visual regression detection with confidence scoring</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
                    <Zap className="w-3 h-3 mr-1" />
                    Beta
                  </Badge>
                  <Button variant="outline" onClick={handleRegenerateInsights}>
                    <Brain className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="visionx-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Insights</p>
                    <p className="text-2xl font-bold">{insights?.length || 0}</p>
                  </div>
                  <Cpu className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="visionx-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Critical Issues</p>
                    <p className="text-2xl font-bold text-destructive">{severityStats.error}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="visionx-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Warnings</p>
                    <p className="text-2xl font-bold text-warning">{severityStats.warning}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="visionx-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Improvements</p>
                    <p className="text-2xl font-bold text-success">{severityStats.info}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="insights" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">All Insights</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4">
            {/* Filters */}
            <Card className="visionx-card">
              <CardHeader>
                <CardTitle>Filter Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search insights..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {insightTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={handleExportInsights}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Insights List */}
            <div className="space-y-4">
              {filteredInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card className="visionx-card hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setSelectedInsight(insight.id)}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                            ${insight.severity === 'error' ? 'bg-destructive/10' : 
                              insight.severity === 'warning' ? 'bg-warning/10' : 'bg-success/10'}`}>
                            {getTypeIcon(insight.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{insight.title}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge className={`${insight.severity === 'error' ? 'bg-destructive/10 text-destructive' :
                                insight.severity === 'warning' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                                {getInsightIcon(insight.severity)}
                                <span className="ml-1">{insight.severity}</span>
                              </Badge>
                              <Badge variant="outline">{insight.confidence}% confidence</Badge>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3">{insight.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>Test: {insight.testResult.testName}</span>
                              <span>•</span>
                              <span>{insight.createdAt ? formatTimeAgo(insight.createdAt) : 'Unknown'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Progress value={insight.confidence} className="w-20 h-2" />
                              <span className="text-sm font-medium">{insight.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredInsights.length === 0 && !isLoading && (
              <Card className="visionx-card">
                <CardContent className="p-12 text-center">
                  <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No AI insights found matching your criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card className="visionx-card">
              <CardHeader>
                <CardTitle>Insight Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Issue Types Over Time</h4>
                    <div className="space-y-3">
                      {insightTypes.slice(0, 5).map((type, index) => {
                        const count = insights?.filter(i => i.type === type).length || 0;
                        const percentage = insights?.length ? (count / insights.length) * 100 : 0;
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">{getTypeIcon(type)}</span>
                              <span className="font-medium">
                                {type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Progress value={percentage} className="w-24 h-2" />
                              <span className="text-sm text-muted-foreground w-8">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-3">Confidence Distribution</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-success">
                          {insights?.filter(i => i.confidence >= 90).length || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">High Confidence (90%+)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-warning">
                          {insights?.filter(i => i.confidence >= 70 && i.confidence < 90).length || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">Medium Confidence (70-89%)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-muted-foreground">
                          {insights?.filter(i => i.confidence < 70).length || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">Low Confidence (&lt;70%)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-4">
            <Card className="visionx-card">
              <CardHeader>
                <CardTitle>AI Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Detection Sensitivity</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Minimum Confidence Threshold</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">70%</span>
                          <Progress value={70} className="w-32 h-2" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Pixel Difference Sensitivity</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Medium</span>
                          <Progress value={60} className="w-32 h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-3">Enabled Detection Types</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {['Position Shift', 'Text Truncation', 'Color Change', 'Layout Shift', 'Size Change', 'Missing Elements'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <label className="text-sm">{type}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
