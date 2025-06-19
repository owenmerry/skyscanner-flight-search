import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { getAnalyticsData } from "./Analytics";
import { getPerformanceData, getPerformanceScore } from "./PerformanceMonitor";
import { SEOScoreIndicator } from "./SEOAnalyzer";

interface AdminData {
  analytics: any;
  performance: any;
  seoScore: number;
  contentStats: {
    totalArticles: number;
    publishedToday: number;
    draftArticles: number;
    scheduledArticles: number;
  };
}

export function EnhancedAdminDashboard() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "performance" | "seo">("overview");

  useEffect(() => {
    const loadAdminData = () => {
      const analytics = getAnalyticsData();
      const performance = getPerformanceData();
      
      // Mock content stats - replace with real data from CMS
      const contentStats = {
        totalArticles: 56,
        publishedToday: 3,
        draftArticles: 12,
        scheduledArticles: 2,
      };

      // Calculate average SEO score
      const seoScore = 85; // Mock score - calculate from actual pages

      setAdminData({
        analytics,
        performance,
        seoScore,
        contentStats
      });
      setLoading(false);
    };

    loadAdminData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NewsHub Admin</h1>
              <p className="text-gray-600">Advanced content management dashboard</p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/g/news"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Site
              </Link>
              <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Article
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: "overview", name: "Overview" },
              { id: "analytics", name: "Analytics" },
              { id: "performance", name: "Performance" },
              { id: "seo", name: "SEO" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Articles</p>
                    <p className="text-2xl font-bold text-gray-900">{adminData?.contentStats.totalArticles}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {adminData?.analytics?.totalViews?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Performance Score</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {adminData?.performance?.latest ? 
                        getPerformanceScore(adminData.performance.latest) : 
                        "--"
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">SEO Score</p>
                    <div className="mt-1">
                      <SEOScoreIndicator score={adminData?.seoScore || 0} />
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Create Article</p>
                      <p className="text-sm text-gray-500">Write a new news article</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">View Analytics</p>
                      <p className="text-sm text-gray-500">Detailed performance metrics</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Site Settings</p>
                      <p className="text-sm text-gray-500">Configure site preferences</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Top Pages</h3>
                  {adminData?.analytics?.topArticles?.length > 0 ? (
                    <div className="space-y-2">
                      {adminData.analytics.topArticles.slice(0, 5).map((article: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 truncate">{article.path}</span>
                          <span className="text-sm font-medium text-gray-900">{article.views}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No analytics data available</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Events</h3>
                  {adminData?.analytics?.events?.length > 0 ? (
                    <div className="space-y-2">
                      {adminData.analytics.events.slice(-5).map((event: any, index: number) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium text-gray-900">{event.name}</span>
                          <span className="text-gray-500 ml-2">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No events recorded</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Core Web Vitals</h2>
              {adminData?.performance?.coreWebVitals ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-gray-700">LCP</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {(adminData.performance.coreWebVitals.lcp / 1000).toFixed(2)}s
                    </p>
                    <p className="text-xs text-gray-500">Largest Contentful Paint</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-gray-700">FID</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {adminData.performance.coreWebVitals.fid.toFixed(0)}ms
                    </p>
                    <p className="text-xs text-gray-500">First Input Delay</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-gray-700">CLS</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {adminData.performance.coreWebVitals.cls.toFixed(3)}
                    </p>
                    <p className="text-xs text-gray-500">Cumulative Layout Shift</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No performance data available</p>
              )}
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Site-wide SEO Score</h3>
                  <SEOScoreIndicator score={adminData?.seoScore || 0} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Wins</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Add meta descriptions to 3 articles</li>
                    <li>• Optimize 5 images with alt text</li>
                    <li>• Improve internal linking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
