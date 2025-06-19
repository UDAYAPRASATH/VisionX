import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Play, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const urlSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Must be a valid URL")
});

const testSuiteSchema = z.object({
  urls: z.array(urlSchema).min(1, "At least one URL is required")
});

type UrlFormData = z.infer<typeof urlSchema>;
type TestSuiteFormData = z.infer<typeof testSuiteSchema>;

export default function TestCaseCreator() {
  const [urls, setUrls] = useState<UrlFormData[]>([
    { name: "amazon", url: "https://www.amazon.in/" },
    { name: "flipkart", url: "https://www.flipkart.com/" }
  ]);
  const [currentUrl, setCurrentUrl] = useState<UrlFormData>({ name: "", url: "" });
  const [isRunning, setIsRunning] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const urlForm = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: currentUrl
  });

  const runTestsMutation = useMutation({
    mutationFn: async (urls: UrlFormData[]) => {
      const response = await fetch("/api/visual-tests/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      setRunId(data.runId);
      setIsRunning(true);
      toast({
        title: "Visual Tests Started",
        description: `Test run ${data.runId} has been started successfully.`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/test-runs"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Start Tests",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  });

  const addUrl = (data: UrlFormData) => {
    if (urls.some(url => url.name === data.name || url.url === data.url)) {
      toast({
        title: "Duplicate Entry",
        description: "URL name or address already exists",
        variant: "destructive"
      });
      return;
    }
    
    setUrls([...urls, data]);
    setCurrentUrl({ name: "", url: "" });
    urlForm.reset({ name: "", url: "" });
    toast({
      title: "URL Added",
      description: `${data.name} has been added to the test suite`
    });
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
    toast({
      title: "URL Removed",
      description: "URL has been removed from the test suite"
    });
  };

  const runTests = () => {
    if (urls.length === 0) {
      toast({
        title: "No URLs",
        description: "Please add at least one URL to test",
        variant: "destructive"
      });
      return;
    }
    runTestsMutation.mutate(urls);
  };

  const generateTestName = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain.split('.')[0];
    } catch {
      return 'website';
    }
  };

  const handleUrlChange = (url: string) => {
    const name = generateTestName(url);
    setCurrentUrl({ name, url });
    urlForm.setValue('name', name);
    urlForm.setValue('url', url);
  };

  return (
    <MainLayout
      title="Visual Test Creator"
      description="Create and manage automated visual regression test suites"
    >
      <div className="space-y-6">
        {/* URL Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Test URL</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...urlForm}>
              <form onSubmit={urlForm.handleSubmit(addUrl)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={urlForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleUrlChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={urlForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Test Name</FormLabel>
                        <FormControl>
                          <Input placeholder="test-name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add URL
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* URL List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>Test Suite</span>
                <Badge variant="secondary">{urls.length} URLs</Badge>
              </div>
              <Button
                onClick={runTests}
                disabled={urls.length === 0 || runTestsMutation.isPending}
                className="flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>{runTestsMutation.isPending ? "Starting..." : "Run Tests"}</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {urls.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No URLs added yet</p>
                <p className="text-sm">Add URLs above to create your test suite</p>
              </div>
            ) : (
              <div className="space-y-3">
                {urls.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg bg-card"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{url.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {url.url}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUrl(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Status */}
        {runId && (
          <Card>
            <CardHeader>
              <CardTitle>Test Execution Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Run ID:</span>
                  <Badge variant="outline">{runId}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge variant={isRunning ? "secondary" : "default"}>
                    {isRunning ? "Running" : "Completed"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Visual regression tests are being executed using Playwright and Groq AI analysis.
                  Results will appear in the dashboard once completed.
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Test Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  const ecommerceUrls = [
                    { name: "amazon", url: "https://www.amazon.com" },
                    { name: "ebay", url: "https://www.ebay.com" },
                    { name: "etsy", url: "https://www.etsy.com" }
                  ];
                  setUrls(ecommerceUrls);
                  toast({
                    title: "Template Loaded",
                    description: "E-commerce sites template has been loaded"
                  });
                }}
              >
                E-commerce Sites
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const newsUrls = [
                    { name: "bbc", url: "https://www.bbc.com" },
                    { name: "cnn", url: "https://www.cnn.com" },
                    { name: "reuters", url: "https://www.reuters.com" }
                  ];
                  setUrls(newsUrls);
                  toast({
                    title: "Template Loaded",
                    description: "News sites template has been loaded"
                  });
                }}
              >
                News Sites
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}