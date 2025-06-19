import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { NewsNavigation } from "~/components/g/NewsNavigation";
import { getFeaturedArticles } from "~/components/g/newsData";

export const meta: MetaFunction = () => {
  return [
    { title: "Page Not Found - NewsHub" },
    { name: "description", content: "The page you're looking for could not be found. Browse our latest news and stories." },
    { name: "robots", content: "noindex, nofollow" },
  ];
};

export default function NewsNotFound() {
  const featuredArticles = getFeaturedArticles().slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <NewsNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* 404 Error Display */}
          <div className="mb-8">
            <div className="mx-auto w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/g/news"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go to Homepage
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </button>
          </div>

          {/* Popular Categories */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Browse by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 max-w-4xl mx-auto">
              {[
                { name: "World", slug: "world", icon: "🌍" },
                { name: "Politics", slug: "politics", icon: "🏛️" },
                { name: "Business", slug: "business", icon: "💼" },
                { name: "Technology", slug: "technology", icon: "💻" },
                { name: "Sports", slug: "sports", icon: "⚽" },
                { name: "Entertainment", slug: "entertainment", icon: "🎬" },
                { name: "Health", slug: "health", icon: "🏥" },
              ].map((category) => (
                <Link
                  key={category.slug}
                  to={`/g/news/category/${category.slug}`}
                  className="group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Popular Stories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredArticles.map((article) => (
                  <article key={article.id} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <Link to={`/g/news/${article.slug}`}>
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {article.category}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                          {article.title}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>{article.author}</span>
                          <span className="mx-2">•</span>
                          <span>{article.readTime} min read</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Search Suggestion */}
          <div className="mt-16 p-6 bg-blue-50 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Looking for something specific?
            </h3>
            <p className="text-blue-700 mb-4">
              Try searching our latest articles or browse by category to find what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search articles..."
                className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
