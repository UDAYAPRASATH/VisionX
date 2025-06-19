import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Calendar, Download } from "lucide-react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/main-layout";
import { RecentTestRuns } from "@/components/dashboard/recent-test-runs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TestRun } from "@shared/schema";

export default function TestRuns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");

  const { data: testRuns, isLoading } = useQuery<TestRun[]>({
    queryKey: ["/api/test-runs", { limit: 50 }],
  });

  const filteredRuns = testRuns?.filter(run => {
    const matchesSearch = run.runId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         run.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || run.status === statusFilter;
    const matchesBranch = branchFilter === "all" || run.branch === branchFilter;
    
    return matchesSearch && matchesStatus && matchesBranch;
  }) || [];

  const uniqueBranches = [...new Set(testRuns?.map(run => run.branch) || [])];

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log("Exporting test runs...");
  };

  return (
    <MainLayout
      title="Test Runs"
      description="View and manage all test executions"
    >
      <div className="space-y-6">
        {/* Filters and Controls */}
        <Card className="visionx-card">
          <CardHeader>
            <CardTitle>Filter Test Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by run ID or branch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                </SelectContent>
              </Select>

              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {uniqueBranches.map(branch => (
                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Calendar className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="visionx-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{filteredRuns.length}</p>
                  <p className="text-sm text-muted-foreground">Total Runs</p>
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
                    {filteredRuns.filter(run => run.status === 'passed').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Passed</p>
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
                  <p className="text-2xl font-bold text-destructive">
                    {filteredRuns.filter(run => run.status === 'failed').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Failed</p>
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
                  <p className="text-2xl font-bold text-warning">
                    {filteredRuns.filter(run => run.status === 'running').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Running</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Test Runs Table */}
        <RecentTestRuns
          testRuns={filteredRuns}
          isLoading={isLoading}
          onViewRun={(runId) => window.open(`/test-runs/${runId}`, '_blank')}
        />
      </div>
    </MainLayout>
  );
}
