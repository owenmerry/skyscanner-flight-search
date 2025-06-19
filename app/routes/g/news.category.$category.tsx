import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import { NewsNavigation } from "~/components/g/NewsNavigation";
import { CategorySection } from "~/components/g/CategorySection";
import { NewsletterSignup } from "~/components/g/NewsletterSignup";
import ContentfulService from "~/components/g/ContentfulService";

const categoryMap: { [key: string]: string } = {
  "world": "World",
  "politics": "Politics", 
  "business": "Business",
  "technology": "Technology",
  "sports": "Sports",
  "entertainment": "Entertainment",
  "health": "Health"
};

export async function loader({ params }: LoaderFunctionArgs) {
  const category = params.category;
  
  if (!category || !categoryMap[category.toLowerCase()]) {
    throw new Response("Not Found", { status: 404 });
  }
  
  const categoryName = categoryMap[category.toLowerCase()];
  const contentfulService = new ContentfulService(
    process.env.CONTENTFUL_SPACE_ID,
    process.env.CONTENTFUL_ENVIRONMENT || "master"
  );

  try {
    // Try to get articles from Contentful
    const articles = await contentfulService.getArticlesByCategory(categoryName);
    
    return json({ 
      category: category.toLowerCase(),
      categoryName,
      articles 
    });
  } catch (error) {
    console.error("Error loading category from Contentful:", error);
    
    // Fallback to mock data
    const { getArticlesByCategory } = await import("~/components/g/newsData");
    const articles = getArticlesByCategory(categoryName);
    
    return json({ 
      category: category.toLowerCase(),
      categoryName,
      articles 
    });
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "Category Not Found - NewsHub" },
      { name: "description", content: "The requested category could not be found." },
    ];
  }

  const { categoryName, articles } = data;

  return [
    { title: `${categoryName} News - Latest Stories & Updates | NewsHub` },
    { 
      name: "description", 
      content: `Stay updated with the latest ${categoryName.toLowerCase()} news, breaking stories, and in-depth analysis. Find comprehensive coverage of ${categoryName.toLowerCase()} events from around the world.` 
    },
    { name: "keywords", content: `${categoryName.toLowerCase()} news, ${categoryName.toLowerCase()} stories, ${categoryName.toLowerCase()} updates, breaking ${categoryName.toLowerCase()}` },
    { property: "og:title", content: `${categoryName} News - Latest Stories & Updates` },
    { property: "og:description", content: `Latest ${categoryName.toLowerCase()} news and breaking stories from around the world.` },
    { property: "og:type", content: "website" },
    { property: "og:image", content: articles.length > 0 ? articles[0].imageUrl : "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=1200&q=80" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: `${categoryName} News - Latest Stories & Updates` },
    { name: "twitter:description", content: `Latest ${categoryName.toLowerCase()} news and breaking stories from around the world.` },
  ];
};

export default function NewsCategory() {
  const { category, categoryName, articles } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      <NewsNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/g/news" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium">
              {categoryName}
            </li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {categoryName} News
            </h1>
            <p className="text-blue-100 text-lg max-w-3xl">
              Stay informed with the latest {categoryName.toLowerCase()} news, breaking stories, and comprehensive coverage from around the world.
            </p>
            <div className="mt-6 flex items-center space-x-4 text-blue-100">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {articles.length} articles
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Updated daily
              </div>
            </div>
          </div>
        </div>

        {/* Articles */}
        {articles.length > 0 ? (
          <CategorySection
            title={`Latest ${categoryName} Stories`}
            articles={articles}
            categorySlug={category}
            showAll={true}
          />
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">
              There are currently no articles in the {categoryName.toLowerCase()} category. 
              Check back later for the latest updates.
            </p>
            <Link 
              to="/g/news" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        )}

        {/* Other Categories */}
        {articles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Other Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(categoryMap)
                .filter(([slug]) => slug !== category)
                .map(([slug, name]) => (
                  <Link
                    key={slug}
                    to={`/g/news/category/${slug}`}
                    className="group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Browse articles
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 max-w-2xl mx-auto">
          <NewsletterSignup />
        </div>
      </main>
    </div>
  );
}
