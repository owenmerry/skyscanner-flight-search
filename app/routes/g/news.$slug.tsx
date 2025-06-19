import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import { NewsNavigation } from "~/components/g/NewsNavigation";
import { RelatedArticles } from "~/components/g/RelatedArticles";
import { NewsletterSignup } from "~/components/g/NewsletterSignup";
import { StructuredData, BreadcrumbStructuredData } from "~/components/g/StructuredData";
import { Analytics, useAnalytics } from "~/components/g/Analytics";
import { PerformanceMonitor } from "~/components/g/PerformanceMonitor";
import { useSEOAnalysis, SEOScoreIndicator } from "~/components/g/SEOAnalyzer";
import ContentfulService from "~/components/g/ContentfulService";
import type { Article } from "~/components/g/newsData";
import { useEffect } from "react";

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug;
  
  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }
  
  const contentfulService = new ContentfulService(
    process.env.CONTENTFUL_SPACE_ID,
    process.env.CONTENTFUL_ENVIRONMENT || "master"
  );

  try {
    // Try to get article from Contentful
    const article = await contentfulService.getArticleBySlug(slug);
    
    if (!article) {
      throw new Response("Not Found", { status: 404 });
    }
    
    // Get related articles
    const relatedArticles = await contentfulService.getRelatedArticles(
      article.id,
      article.category,
      article.tags
    );
    
    return json({ article, relatedArticles });
  } catch (error) {
    console.error("Error loading article from Contentful:", error);
    
    // Fallback to mock data
    const { getArticleBySlug, getRelatedArticles } = await import("~/components/g/newsData");
    
    const article = getArticleBySlug(slug);
    
    if (!article) {
      throw new Response("Not Found", { status: 404 });
    }
    
    const relatedArticles = getRelatedArticles(article);
    
    return json({ article, relatedArticles });
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.article) {
    return [
      { title: "Article Not Found - NewsHub" },
      { name: "description", content: "The requested article could not be found." },
    ];
  }

  const { article } = data;
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;

  return [
    { title: `${title} - NewsHub` },
    { name: "description", content: description },
    { name: "keywords", content: article.tags.join(", ") },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:image", content: article.imageUrl },
    { property: "article:author", content: article.author },
    { property: "article:published_time", content: article.publishedAt },
    { property: "article:section", content: article.category },
    { property: "article:tag", content: article.tags.join(",") },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: article.imageUrl },
  ];
};

export default function NewsArticle() {
  const { article, relatedArticles } = useLoaderData<typeof loader>();
  const { trackArticleView, trackSocialShare } = useAnalytics();
  const seoAnalysis = useSEOAnalysis(article);

  useEffect(() => {
    // Track article view
    trackArticleView(article.slug, article.category, article.author);
  }, [article.slug, article.category, article.author, trackArticleView]);

  const handleSocialShare = (platform: string) => {
    trackSocialShare(platform, article.slug);
  };

  const publishedDate = new Date(article.publishedAt);
  const formattedDate = publishedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = publishedDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const breadcrumbItems = [
    { name: "Home", url: "/g/news" },
    { name: article.category, url: `/g/news/category/${article.category.toLowerCase()}` },
    { name: article.title, url: `/g/news/${article.slug}` }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Analytics enableGoogleAnalytics={true} enableCustomTracking={true} />
      <PerformanceMonitor />
      <StructuredData type="article" data={{ article }} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <NewsNavigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <li>
              <Link 
                to={`/g/news/category/${article.category.toLowerCase()}`}
                className="hover:text-blue-600"
              >
                {article.category}
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium truncate">
              {article.title}
            </li>
          </ol>
        </nav>

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Article Header */}
          <header className="p-8 pb-0">
            <div className="flex items-center space-x-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {article.category}
              </span>
              {article.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {article.excerpt}
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {article.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{article.author}</p>
                    <p className="text-sm text-gray-500">Journalist</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {article.readTime} min read
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time dateTime={article.publishedAt}>
                    {formattedDate} at {formattedTime}
                  </time>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="px-8 py-6">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>

          {/* Article Content */}
          <div className="px-8 pb-8">
            <div 
              className="prose prose-lg max-w-none prose-blue prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            
            {/* Social Sharing */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleSocialShare('twitter')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  Tweet
                </button>
                <button 
                  onClick={() => handleSocialShare('facebook')}
                  className="inline-flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                  Share
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    handleSocialShare('copy_link');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <RelatedArticles 
              articles={relatedArticles} 
              currentArticleId={article.id}
            />
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-12 max-w-2xl mx-auto">
          <NewsletterSignup />
        </div>
      </main>
    </div>
  );
}
