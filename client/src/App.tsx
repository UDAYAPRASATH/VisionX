import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import TestRuns from "@/pages/test-runs";
import VisualDiff from "@/pages/visual-diff";
import AiInsights from "@/pages/ai-insights";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import TestCaseCreator from "@/pages/test-case-creator";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/test-runs" component={TestRuns} />
      <Route path="/visual-diff" component={VisualDiff} />
      <Route path="/ai-insights" component={AiInsights} />
      <Route path="/test-creator" component={TestCaseCreator} />
      <Route path="/reports" component={Reports} />
      <Route path="/settings" component={Settings} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
