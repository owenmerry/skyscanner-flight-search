import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSearchParams, Form } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState } from "react";
import { NewsNavigation } from "~/components/g/NewsNavigation";
import { NewsCard } from "~/components/g/NewsCard";
import { NewsletterSignup } from "~/components/g/NewsletterSignup";
import { NewsSkeleton } from "~/components/g/NewsSkeleton";
import { 
  mockArticles, 
  type Article 
} from "~/components/g/newsData";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const category = url.searchParams.get("category") || "";
  const sortBy = url.searchParams.get("sort") || "relevance";
  
  let results: Article[] = [];
  
  if (query.trim()) {
    // Simple search implementation - in production, you'd use a proper search service
    results = mockArticles.filter(article => {
      const searchText = query.toLowerCase();
      const matchesTitle = article.title.toLowerCase().includes(searchText);
      const matchesExcerpt = article.excerpt.toLowerCase().includes(searchText);
      const matchesContent = article.content.toLowerCase().includes(searchText);
      const matchesTags = article.tags.some(tag => tag.toLowerCase().includes(searchText));
      const matchesAuthor = article.author.toLowerCase().includes(searchText);
      const matchesCategory = category ? article.category.toLowerCase() === category.toLowerCase() : true;
      
      return (matchesTitle || matchesExcerpt || matchesContent || matchesTags || matchesAuthor) && matchesCategory;
    });
    
    // Sort results
    if (sortBy === "date") {
      results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === "title") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }
    // Default is relevance (keep current order)
  }
  
  return json({ 
    results, 
    query, 
    category, 
    sortBy,
    totalResults: results.length 
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const query = data?.query || "";
  const totalResults = data?.totalResults || 0;
  
  if (query) {
    return [
      { title: `Search Results for "${query}" - NewsHub` },
      { 
        name: "description", 
        content: `Found ${totalResults} articles matching "${query}". Search the latest news, breaking stories, and in-depth coverage.` 
      },
      { name: "robots", content: "noindex, nofollow" }, // Don't index search results
    ];
  }
  
  return [
    { title: "Search News Articles - NewsHub" },
    { name: "description", content: "Search through our comprehensive collection of news articles, breaking stories, and in-depth coverage." },
  ];
};

export default function NewsSearch() {
  const { results, query, category, sortBy, totalResults } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { name: "All Categories", value: "" },
    { name: "World", value: "world" },
    { name: "Politics", value: "politics" },
    { name: "Business", value: "business" },
    { name: "Technology", value: "technology" },
    { name: "Sports", value: "sports" },
    { name: "Entertainment", value: "entertainment" },
    { name: "Health", value: "health" },
  ];

  const sortOptions = [
    { name: "Relevance", value: "relevance" },
    { name: "Most Recent", value: "date" },
    { name: "Title A-Z", value: "title" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NewsNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search News</h1>
          <p className="text-gray-600">
            Find the latest news articles, breaking stories, and in-depth coverage
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <Form method="get" className="space-y-4">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Articles
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Enter keywords, topics, or author names..."
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue={category}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  id="sort"
                  name="sort"
                  defaultValue={sortBy}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  onClick={() => setIsLoading(true)}
                  className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>
          </Form>
        </div>

        {/* Search Results */}
        {query && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Search Results
                </h2>
                <p className="text-gray-600">
                  {totalResults > 0 
                    ? `Found ${totalResults} article${totalResults === 1 ? '' : 's'} for "${query}"`
                    : `No articles found for "${query}"`
                  }
                  {category && (
                    <span className="ml-1">
                      in {categories.find(c => c.value === category)?.name}
                    </span>
                  )}
                </p>
              </div>
              
              {totalResults > 0 && (
                <div className="text-sm text-gray-500">
                  Sorted by {sortOptions.find(s => s.value === sortBy)?.name}
                </div>
              )}
            </div>

            {/* Loading State */}
            {isLoading ? (
              <NewsSkeleton type="list" count={6} />
            ) : totalResults > 0 ? (
              /* Results Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : query ? (
              /* No Results */
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any articles matching your search. Try different keywords or browse our categories.
                </p>
                
                {/* Search Suggestions */}
                <div className="max-w-md mx-auto">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Search suggestions:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["breaking news", "technology", "politics", "business", "sports"].map((suggestion) => (
                      <Form key={suggestion} method="get" className="inline">
                        <input type="hidden" name="q" value={suggestion} />
                        <button
                          type="submit"
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      </Form>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Popular Search Terms */}
        {!query && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Search Terms</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "Breaking News", "Climate Change", "Technology", "Elections",
                  "Stock Market", "Sports Updates", "Health News", "Entertainment",
                  "Business", "World News", "Politics", "Science"
                ].map((term) => (
                  <Form key={term} method="get" className="inline">
                    <input type="hidden" name="q" value={term} />
                    <button
                      type="submit"
                      className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                          {term}
                        </span>
                      </div>
                    </button>
                  </Form>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="max-w-2xl mx-auto">
          <NewsletterSignup />
        </div>
      </main>
    </div>
  );
}
