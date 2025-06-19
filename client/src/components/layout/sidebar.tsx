import { Link, useLocation } from "wouter";
import { Eye, Home, PlayCircle, GitCompare, Cpu, FileText, Settings, User, MoreHorizontal, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Test Runs", href: "/test-runs", icon: PlayCircle },
  { name: "Visual Diff", href: "/visual-diff", icon: GitCompare },
  { name: "AI Insights", href: "/ai-insights", icon: Cpu },
  { name: "Test Creator", href: "/test-creator", icon: Plus },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-sidebar-background border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <motion.div 
            className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold text-sidebar-foreground">VisionX</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                className={cn(
                  "visionx-nav-item",
                  isActive ? "visionx-nav-item-active" : "visionx-nav-item-inactive"
                )}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-sidebar-foreground">VisionX</p>
            <p className="text-xs text-muted-foreground">Test</p>
          </div>
          <motion.button 
            className="p-1 hover:bg-accent rounded transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        </motion.div>
      </div>
    </aside>
  );
}
