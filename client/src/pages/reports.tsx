import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileText, Download, Share2, Calendar, Filter, BarChart3, PieChart, TrendingUp, ExternalLink, Mail, Eye } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { formatTimeAgo, formatDuration, formatPercentage } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { TestRun, TestResult } from "@shared/schema";
import { DashboardStats } from "@/types";

interface Report {
  id: string;
  name: string;
  type: 'summary' | 'detailed' | 'trend' | 'comparison';
  createdAt: Date;
  status: 'ready' | 'generating' | 'failed';
  size: string;
  sharedWith: string[];
}

export default function Reports() {
  const { toast } = useToast();
  const [selectedReportType, setSelectedReportType] = useState<string>("summary");
  const [reportName, setReportName] = useState("");
  const [includeScreenshots, setIncludeScreenshots] = useState(true);
  const [includeAIInsights, setIncludeAIInsights] = useState(true);
  const [shareEmail, setShareEmail] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  const { data: testRuns } = useQuery<TestRun[]>({
    queryKey: ["/api/test-runs", { limit: 20 }],
  });

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  // Mock reports data - in real implementation this would come from API
  const reports: Report[] = [
    {
      id: "report-001",
      name: "Weekly Test Summary",
      type: "summary",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "ready",
      size: "2.3 MB",
      sharedWith: ["team@company.com", "qa@company.com"],
    },
    {
      id: "report-002", 
      name: "Feature Branch Analysis",
      type: "detailed",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "ready",
      size: "5.7 MB",
      sharedWith: ["dev-team@company.com"],
    },
    {
      id: "report-003",
      name: "Monthly Trends Report",
      type: "trend",
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      status: "generating",
      size: "-",
      sharedWith: [],
    },
  ];

  const reportTypes = [
    { id: "summary", name: "Summary Report", description: "High-level overview with key metrics", icon: BarChart3 },
    { id: "detailed", name: "Detailed Report", description: "Comprehensive analysis with screenshots", icon: FileText },
    { id: "trend", name: "Trend Analysis", description: "Historical performance trends", icon: TrendingUp },
    { id: "comparison", name: "Comparison Report", description: "Compare multiple test runs", icon: PieChart },
  ];

  const handleGenerateReport = () => {
    if (!reportName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a report name.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Generating Report",
      description: `Your ${selectedReportType} report "${reportName}" is being generated.`,
    });

    // Reset form
    setReportName("");
    setReportDescription("");
  };

  const handleDownloadReport = (reportId: string, reportName: string) => {
    toast({
      title: "Downloading Report",
      description: `${reportName} is being downloaded.`,
    });
  };

  const handleShareReport = (reportId: string, reportName: string) => {
    if (!shareEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address to share with.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Report Shared",
      description: `${reportName} has been shared with ${shareEmail}.`,
    });
    setShareEmail("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-success/10 text-success">Ready</Badge>;
      case 'generating':
        return <Badge className="bg-warning/10 text-warning">Generating</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    const reportType = reportTypes.find(t => t.id === type);
    if (!reportType) return FileText;
    return reportType.icon;
  };

  return (
    <MainLayout
      title="Reports"
      description="Generate and share comprehensive test reports"
    >
      <div className="space-y-6">
        <Tabs defaultValue="generate" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">Generate Report</TabsTrigger>
            <TabsTrigger value="existing">Existing Reports</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            {/* Report Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="visionx-card">
                <CardHeader>
                  <CardTitle>Select Report Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {reportTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <motion.div
                          key={type.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all ${
                              selectedReportType === type.id
                                ? 'ring-2 ring-primary bg-primary/5'
                                : 'hover:shadow-md'
                            }`}
                            onClick={() => setSelectedReportType(type.id)}
                          >
                            <CardContent className="p-4">
                              <div className="text-center space-y-2">
                                <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center ${
                                  selectedReportType === type.id ? 'bg-primary text-white' : 'bg-muted'
                                }`}>
                                  <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold">{type.name}</h3>
                                <p className="text-sm text-muted-foreground">{type.description}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Report Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="visionx-card">
                <CardHeader>
                  <CardTitle>Report Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="report-name">Report Name</Label>
                        <Input
                          id="report-name"
                          placeholder="Enter report name..."
                          value={reportName}
                          onChange={(e) => setReportName(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="report-description">Description (Optional)</Label>
                        <Textarea
                          id="report-description"
                          placeholder="Add a description for this report..."
                          value={reportDescription}
                          onChange={(e) => setReportDescription(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-semibold">Include Options</Label>
                        <div className="space-y-3 mt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="screenshots"
                              checked={includeScreenshots}
                              onCheckedChange={(checked) => setIncludeScreenshots(checked === true)}
                            />
                            <Label htmlFor="screenshots">Include Screenshots</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="ai-insights"
                              checked={includeAIInsights}
                              onCheckedChange={(checked) => setIncludeAIInsights(checked === true)}
                            />
                            <Label htmlFor="ai-insights">Include AI Insights</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="test-details" defaultChecked />
                            <Label htmlFor="test-details">Include Test Details</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="performance-metrics" defaultChecked />
                            <Label htmlFor="performance-metrics">Include Performance Metrics</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Report will include data from the last 30 days
                    </div>
                    <Button onClick={handleGenerateReport} className="visionx-button-primary">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="existing" className="space-y-4">
            {/* Report Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="visionx-card">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{reports.length}</p>
                      <p className="text-sm text-muted-foreground">Total Reports</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="visionx-card">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">
                        {reports.filter(r => r.status === 'ready').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Ready</p>
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
                    <div className="text-center">
                      <p className="text-2xl font-bold text-warning">
                        {reports.filter(r => r.status === 'generating').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Generating</p>
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
                    <div className="text-center">
                      <p className="text-2xl font-bold">8.4 MB</p>
                      <p className="text-sm text-muted-foreground">Total Size</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {reports.map((report, index) => {
                const Icon = getTypeIcon(report.type);
                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="visionx-card hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{report.name}</h3>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-muted-foreground">
                                  {reportTypes.find(t => t.id === report.type)?.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {formatTimeAgo(report.createdAt)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {report.size}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            {getStatusBadge(report.status)}
                            
                            {report.sharedWith.length > 0 && (
                              <Badge variant="outline">
                                Shared with {report.sharedWith.length}
                              </Badge>
                            )}
                            
                            <div className="flex items-center space-x-2">
                              {report.status === 'ready' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadReport(report.id, report.name)}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                              <Button variant="outline" size="sm">
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {report.sharedWith.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground mb-2">Shared with:</p>
                            <div className="flex flex-wrap gap-2">
                              {report.sharedWith.map((email) => (
                                <Badge key={email} variant="secondary" className="text-xs">
                                  {email}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Share Report Section */}
            <Card className="visionx-card">
              <CardHeader>
                <CardTitle>Share Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Input
                    placeholder="Enter email address..."
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={() => handleShareReport("latest", "Selected Report")}>
                    <Mail className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card className="visionx-card">
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Daily Standup Report", description: "Quick daily overview for team standups" },
                    { name: "Sprint Summary", description: "Comprehensive sprint completion report" },
                    { name: "Release Candidate", description: "Pre-release validation report" },
                    { name: "Performance Benchmark", description: "Performance comparison over time" },
                    { name: "Quality Metrics", description: "Quality assurance metrics and trends" },
                    { name: "Executive Summary", description: "High-level summary for stakeholders" },
                  ].map((template, index) => (
                    <motion.div
                      key={template.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="cursor-pointer hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-2">{template.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                          <Button variant="outline" className="w-full">
                            Use Template
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
