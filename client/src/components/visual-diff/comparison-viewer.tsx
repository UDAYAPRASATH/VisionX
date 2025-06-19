import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Eye, EyeOff, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import type { ScreenshotComparison, ComparisonMode } from "@/types";

interface ComparisonViewerProps {
  comparison: ScreenshotComparison;
  mode: ComparisonMode;
  onModeChange: (mode: ComparisonMode) => void;
}

export function ComparisonViewer({ comparison, mode, onModeChange }: ComparisonViewerProps) {
  const [sliderValue, setSliderValue] = useState([50]);
  const [showOverlay, setShowOverlay] = useState(true);
  const [zoom, setZoom] = useState(100);

  const comparisonModes: ComparisonMode[] = [
    { id: 'side-by-side', name: 'Side by Side', description: 'View baseline and actual side by side' },
    { id: 'slider', name: 'Slider', description: 'Slide between baseline and actual' },
    { id: 'overlay', name: 'Overlay', description: 'Overlay actual on baseline' },
    { id: 'onion-skin', name: 'Onion Skin', description: 'Semi-transparent overlay' },
  ];

  const renderComparison = () => {
    switch (mode.id) {
      case 'side-by-side':
        return (
          <div className="grid grid-cols-2 gap-4 h-96">
            <div className="relative">
              <Badge className="absolute top-2 left-2 z-10 bg-blue-500 text-white">
                Baseline
              </Badge>
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg" />
            </div>
            <div className="relative">
              <Badge className="absolute top-2 left-2 z-10 bg-orange-500 text-white">
                Actual
              </Badge>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-lg" />
            </div>
          </div>
        );

      case 'slider':
        return (
          <div className="relative h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-lg"
              style={{ clipPath: `inset(0 ${100 - sliderValue[0]}% 0 0)` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <div className="absolute bottom-4 left-4 right-4">
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <Badge className="absolute top-2 left-2 z-10 bg-blue-500 text-white">
              {sliderValue[0] > 50 ? 'Baseline' : 'Actual'}
            </Badge>
          </div>
        );

      case 'overlay':
        return (
          <div className="relative h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg" />
            <AnimatePresence>
              {showOverlay && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-lg"
                />
              )}
            </AnimatePresence>
            <div className="absolute top-2 left-2 space-x-2">
              <Badge className="bg-blue-500 text-white">Baseline</Badge>
              {showOverlay && (
                <Badge className="bg-orange-500 text-white">Actual</Badge>
              )}
            </div>
          </div>
        );

      case 'onion-skin':
        return (
          <div className="relative h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-lg opacity-50" />
            <Badge className="absolute top-2 left-2 bg-purple-500 text-white">
              Onion Skin
            </Badge>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Selection */}
      <div className="flex space-x-2">
        {comparisonModes.map((compMode) => (
          <Button
            key={compMode.id}
            variant={mode.id === compMode.id ? "default" : "outline"}
            onClick={() => onModeChange(compMode)}
            className="text-sm"
          >
            {compMode.name}
          </Button>
        ))}
      </div>

      {/* Viewer */}
      <Card className="visionx-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">{mode.name} View</h3>
              <p className="text-sm text-muted-foreground">{mode.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              {mode.id === 'overlay' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOverlay(!showOverlay)}
                >
                  {showOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              )}
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(25, zoom - 25))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm w-12 text-center">{zoom}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <motion.div
            style={{ scale: zoom / 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="origin-top-left"
          >
            {renderComparison()}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
