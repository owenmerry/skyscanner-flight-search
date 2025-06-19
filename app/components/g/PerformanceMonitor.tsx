import { useEffect, useState } from "react";

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoadedTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      
      const performanceMetrics: PerformanceMetrics = {
        pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoadedTime: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0,
      };

      // Get Core Web Vitals
      if ('PerformanceObserver' in window) {
        // First Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            performanceMetrics.firstContentfulPaint = fcpEntry.startTime;
          }
        }).observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            performanceMetrics.largestContentfulPaint = lastEntry.startTime;
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          performanceMetrics.cumulativeLayoutShift = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });

        // First Input Delay
        new PerformanceObserver((list) => {
          const firstEntry = list.getEntries()[0];
          if (firstEntry) {
            performanceMetrics.firstInputDelay = (firstEntry as any).processingStart - firstEntry.startTime;
          }
        }).observe({ entryTypes: ['first-input'] });
      }

      setMetrics(performanceMetrics);
      
      // Store metrics for admin dashboard
      storePerformanceMetrics(performanceMetrics);
    };

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  return null; // This component doesn't render anything
}

function storePerformanceMetrics(metrics: PerformanceMetrics) {
  if (typeof window === "undefined") return;

  try {
    const storedMetrics = JSON.parse(localStorage.getItem("newsHub_performance") || "[]");
    
    const entry = {
      ...metrics,
      timestamp: new Date().toISOString(),
      url: window.location.pathname + window.location.search,
      userAgent: navigator.userAgent,
    };
    
    storedMetrics.push(entry);
    
    // Keep only last 100 entries
    if (storedMetrics.length > 100) {
      storedMetrics.splice(0, storedMetrics.length - 100);
    }
    
    localStorage.setItem("newsHub_performance", JSON.stringify(storedMetrics));
  } catch (error) {
    console.warn("Failed to store performance metrics:", error);
  }
}

export function getPerformanceData() {
  if (typeof window === "undefined") return null;

  try {
    const metrics = JSON.parse(localStorage.getItem("newsHub_performance") || "[]");
    
    if (metrics.length === 0) return null;

    // Calculate averages
    const averages = metrics.reduce((acc: any, metric: any) => {
      Object.keys(metric).forEach(key => {
        if (typeof metric[key] === 'number') {
          acc[key] = (acc[key] || 0) + metric[key];
        }
      });
      return acc;
    }, {});

    Object.keys(averages).forEach(key => {
      averages[key] = averages[key] / metrics.length;
    });

    return {
      latest: metrics[metrics.length - 1],
      averages,
      history: metrics,
      coreWebVitals: {
        lcp: averages.largestContentfulPaint,
        fid: averages.firstInputDelay,
        cls: averages.cumulativeLayoutShift,
      }
    };
  } catch (error) {
    console.warn("Failed to get performance data:", error);
    return null;
  }
}

// Performance scoring
export function getPerformanceScore(metrics: PerformanceMetrics): number {
  let score = 100;
  
  // LCP scoring (Good: <2.5s, Needs Improvement: 2.5-4s, Poor: >4s)
  if (metrics.largestContentfulPaint > 4000) score -= 30;
  else if (metrics.largestContentfulPaint > 2500) score -= 15;
  
  // FID scoring (Good: <100ms, Needs Improvement: 100-300ms, Poor: >300ms)
  if (metrics.firstInputDelay > 300) score -= 25;
  else if (metrics.firstInputDelay > 100) score -= 10;
  
  // CLS scoring (Good: <0.1, Needs Improvement: 0.1-0.25, Poor: >0.25)
  if (metrics.cumulativeLayoutShift > 0.25) score -= 25;
  else if (metrics.cumulativeLayoutShift > 0.1) score -= 10;
  
  // Page load time scoring
  if (metrics.pageLoadTime > 5000) score -= 20;
  else if (metrics.pageLoadTime > 3000) score -= 10;
  
  return Math.max(0, score);
}

// Hook for components to access performance data
export function usePerformance() {
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    const data = getPerformanceData();
    setPerformanceData(data);
  }, []);

  return performanceData;
}
