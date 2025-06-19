import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";

interface AnalyticsData {
  totalViews: number;
  todayViews: number;
  topArticles: Array<{
    title: string;
    slug: string;
    views: number;
    category: string;
  }>;
  categoryStats: Array<{
    category: string;
    articleCount: number;
    totalViews: number;
  }>;
  recentActivity: Array<{
    action: string;
    article: string;
    timestamp: string;
    user: string;
  }>;
}

export function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock analytics data - replace with real analytics API
    const mockAnalytics: AnalyticsData = {
      totalViews: 145632,
      todayViews: 2847,
      topArticles: [
        {
          title: "Global Climate Summit Reaches Historic Agreement",
          slug: "global-climate-summit-historic-agreement",
          views: 12543,
          category: "World"
        },
        {
          title: "Tech Giants Unveil Revolutionary AI Healthcare Platform",
          slug: "tech-giants-ai-healthcare-platform", 
          views: 9876,
          category: "Technology"
        },
        {
          title: "Stock Markets Surge Following Fed Decision",
          slug: "stock-markets-surge-fed-rate-decision",
          views: 8765,
          category: "Business"
        }
      ],
      categoryStats: [
        { category: "World", articleCount: 15, totalViews: 45000 },
        { category: "Technology", articleCount: 12, totalViews: 38000 },
        { category: "Business", articleCount: 10, totalViews: 32000 },
        { category: "Sports", articleCount: 8, totalViews: 28000 },
        { category: "Health", articleCount: 6, totalViews: 18000 },
        { category: "Entertainment", articleCount: 5, totalViews: 15000 }
      ],
      recentActivity: [
        {
          action: "Published",
          article: "Championship Victory: Eagles Make History", 
          timestamp: "2 hours ago",
          user: "Sarah Johnson"
        },
        {
          action: "Updated",
          article: "Climate Summit Agreement",
          timestamp: "4 hours ago", 
          user: "Michael Rodriguez"
        },
        {
          action: "Draft Created",
          article: "New Healthcare Regulations",
          timestamp: "6 hours ago",
          user: "Dr. Lisa Wang"
        }
      ]
    };

    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NewsHub Admin</h1>
              <p className="text-gray-600">Content management dashboard</p>
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Today's Views</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.todayViews.toLocaleString()}</p>
                <p className="text-sm text-green-600">+12% from yesterday</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Published Articles</p>
                <p className="text-2xl font-bold text-gray-900">56</p>
                <p className="text-sm text-blue-600">3 published today</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Draft Articles</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-orange-600">5 need review</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Articles */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Top Performing Articles</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.topArticles.map((article, index) => (
                  <div key={article.slug} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/g/news/${article.slug}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {article.title}
                      </Link>
                      <p className="text-xs text-gray-500">{article.category}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-sm font-medium text-gray-900">{article.views.toLocaleString()}</span>
                      <p className="text-xs text-gray-500">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Category Performance</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.categoryStats.map((category) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/g/news/category/${category.category.toLowerCase()}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {category.category}
                      </Link>
                      <span className="text-xs text-gray-500">{category.articleCount} articles</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{category.totalViews.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">total views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.action === 'Published' ? 'bg-green-400' :
                      activity.action === 'Updated' ? 'bg-blue-400' : 'bg-yellow-400'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>
                      {' '}
                      <span className="text-gray-600">{activity.action.toLowerCase()}</span>
                      {' '}
                      <span className="font-medium">"{activity.article}"</span>
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
