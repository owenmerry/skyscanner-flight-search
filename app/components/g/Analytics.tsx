import { useEffect } from "react";
import { useLocation } from "@remix-run/react";

interface AnalyticsProps {
  trackingId?: string;
  enableGoogleAnalytics?: boolean;
  enableCustomTracking?: boolean;
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function Analytics({ 
  trackingId = "G-XXXXXXXXXX", 
  enableGoogleAnalytics = true,
  enableCustomTracking = true 
}: AnalyticsProps) {
  const location = useLocation();

  useEffect(() => {
    if (enableGoogleAnalytics && trackingId && typeof window !== "undefined") {
      // Initialize Google Analytics
      if (!window.gtag) {
        // Load Google Analytics script
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        document.head.appendChild(script);

        // Initialize dataLayer and gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
          window.dataLayer.push(arguments);
        };
        window.gtag("js", new Date());
        window.gtag("config", trackingId, {
          page_path: location.pathname + location.search,
        });
      }
    }
  }, [trackingId, enableGoogleAnalytics]);

  useEffect(() => {
    // Track page views
    if (enableGoogleAnalytics && window.gtag) {
      window.gtag("config", trackingId, {
        page_path: location.pathname + location.search,
      });
    }

    if (enableCustomTracking) {
      // Custom analytics tracking
      trackPageView(location.pathname + location.search);
    }
  }, [location, trackingId, enableGoogleAnalytics, enableCustomTracking]);

  return null;
}

// Custom analytics functions
export function trackPageView(page: string) {
  if (typeof window === "undefined") return;

  try {
    // Store page view in localStorage for admin dashboard
    const pageViews = JSON.parse(localStorage.getItem("newsHub_pageViews") || "{}");
    const today = new Date().toISOString().split("T")[0];
    
    if (!pageViews[today]) {
      pageViews[today] = {};
    }
    
    pageViews[today][page] = (pageViews[today][page] || 0) + 1;
    
    // Keep only last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    Object.keys(pageViews).forEach(date => {
      if (new Date(date) < thirtyDaysAgo) {
        delete pageViews[date];
      }
    });
    
    localStorage.setItem("newsHub_pageViews", JSON.stringify(pageViews));
  } catch (error) {
    console.warn("Analytics tracking failed:", error);
  }
}

export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window === "undefined") return;

  // Google Analytics event tracking
  if (window.gtag) {
    window.gtag("event", eventName, parameters);
  }

  // Custom event tracking
  try {
    const events = JSON.parse(localStorage.getItem("newsHub_events") || "[]");
    events.push({
      name: eventName,
      parameters,
      timestamp: new Date().toISOString(),
    });
    
    // Keep only last 1000 events
    if (events.length > 1000) {
      events.splice(0, events.length - 1000);
    }
    
    localStorage.setItem("newsHub_events", JSON.stringify(events));
  } catch (error) {
    console.warn("Event tracking failed:", error);
  }
}

export function trackArticleView(articleSlug: string, category: string, author: string) {
  trackEvent("article_view", {
    article_slug: articleSlug,
    category,
    author,
  });
}

export function trackSearch(query: string, results: number) {
  trackEvent("search", {
    search_term: query,
    results_count: results,
  });
}

export function trackNewsletterSignup(email?: string) {
  trackEvent("newsletter_signup", {
    email_provided: !!email,
  });
}

export function trackSocialShare(platform: string, articleSlug: string) {
  trackEvent("social_share", {
    platform,
    article_slug: articleSlug,
  });
}

// Analytics hook for components
export function useAnalytics() {
  return {
    trackEvent,
    trackPageView,
    trackArticleView,
    trackSearch,
    trackNewsletterSignup,
    trackSocialShare,
  };
}

// Get analytics data for admin dashboard
export function getAnalyticsData() {
  if (typeof window === "undefined") return null;

  try {
    const pageViews = JSON.parse(localStorage.getItem("newsHub_pageViews") || "{}");
    const events = JSON.parse(localStorage.getItem("newsHub_events") || "[]");
    
    const today = new Date().toISOString().split("T")[0];
    const todayViews = pageViews[today] || {};
    
    // Calculate total views
    let totalViews = 0;
    Object.values(pageViews).forEach((dayViews: any) => {
      Object.values(dayViews).forEach((count: any) => {
        totalViews += count;
      });
    });
    
    // Calculate today's views
    const todayTotal = Object.values(todayViews).reduce((sum: number, count: any) => sum + count, 0);
    
    // Get top articles
    const articleViews: Record<string, number> = {};
    Object.values(pageViews).forEach((dayViews: any) => {
      Object.entries(dayViews).forEach(([page, count]: [string, any]) => {
        if (page.startsWith("/g/news/") && !page.includes("/category/") && !page.includes("/search")) {
          articleViews[page] = (articleViews[page] || 0) + count;
        }
      });
    });
    
    const topArticles = Object.entries(articleViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, views]) => ({
        path,
        views,
        slug: path.replace("/g/news/", ""),
      }));
    
    return {
      totalViews,
      todayViews: todayTotal,
      topArticles,
      events: events.slice(-100), // Last 100 events
      rawPageViews: pageViews,
    };
  } catch (error) {
    console.warn("Failed to get analytics data:", error);
    return null;
  }
}
