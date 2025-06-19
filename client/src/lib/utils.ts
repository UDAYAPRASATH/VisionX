import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }
  
  return `${minutes}m ${remainingSeconds}s`;
}

export function formatTimeAgo(date: Date | string | null): string {
  if (!date) return 'Unknown';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return "just now";
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  return date.toLocaleDateString();
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'passed':
    case 'success':
      return 'text-success';
    case 'failed':
    case 'error':
      return 'text-destructive';
    case 'running':
    case 'pending':
      return 'text-warning';
    case 'cancelled':
    case 'skipped':
      return 'text-muted-foreground';
    default:
      return 'text-foreground';
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'passed':
    case 'success':
      return 'visionx-status-passed';
    case 'failed':
    case 'error':
      return 'visionx-status-failed';
    case 'running':
    case 'pending':
      return 'visionx-status-running';
    default:
      return 'visionx-status-badge bg-muted text-muted-foreground';
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'text-destructive';
    case 'high':
      return 'text-destructive';
    case 'medium':
    case 'warning':
      return 'text-warning';
    case 'low':
    case 'info':
      return 'text-primary';
    default:
      return 'text-muted-foreground';
  }
}

export function getSeverityIcon(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
    case 'error':
      return 'x-circle';
    case 'high':
      return 'alert-triangle';
    case 'medium':
    case 'warning':
      return 'alert-triangle';
    case 'low':
    case 'info':
      return 'info';
    default:
      return 'circle';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
