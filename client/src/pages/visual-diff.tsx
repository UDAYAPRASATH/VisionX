import { useState, useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MainLayout } from "@/components/layout/main-layout";
import { ComparisonViewer } from "@/components/visual-diff/comparison-viewer";
import { DiffControls } from "@/components/visual-diff/diff-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { TestResult } from "@shared/schema";
import type { ScreenshotComparison, ComparisonMode } from "@/types";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function VisualDiff() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [diffImages, setDiffImages] = useState<string[]>([
    // ...existing filenames...
  ]);

  const handleDeleteImage = (filename: string) => {
    setDiffImages((prev) => prev.filter((img) => img !== filename));
  };

  return (
    <MainLayout title={""} description={""}      // ...existing props...
    >
      <div className="space-y-6">
        {/* ...existing components... */}
        <Card className="visionx-card mt-4">
          <CardHeader>
            <CardTitle>All Diff Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {diffImages.map((filename, idx) => (
                <div key={filename} className="flex flex-col items-center bg-gray-50 rounded-lg shadow p-4">
                  <img
                    src={`/diffimage/${filename}`}
                    alt={`Diff ${idx + 1}`}
                    className="rounded border border-gray-300 max-w-full max-h-64 mb-2 shadow-lg cursor-pointer"
                    onClick={() => setPreviewImage(`/diffimage/${filename}`)}
                  />
                  <div className="text-xs text-muted-foreground font-mono break-all mb-2">{filename}</div>
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => setPreviewImage(`/diffimage/${filename}`)}
                    >
                      Preview
                    </button>
                    <button
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDeleteImage(filename)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Preview Modal */}
            <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
              <DialogContent>
                <div className="flex flex-col items-center">
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{ maxWidth: "90vw", maxHeight: "70vh", display: "block" }}
                    />
                  )}
                  <button
                    className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
                    onClick={() => setPreviewImage(null)}
                  >
                    Close
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        {/* ...existing components... */}
      </div>
    </MainLayout>
  );
}