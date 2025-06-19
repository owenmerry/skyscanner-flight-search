import { Link } from "@remix-run/react";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
  slug: string;
  author: string;
  readTime: number;
}

interface RelatedArticlesProps {
  articles: Article[];
  currentArticleId: string;
}

export function RelatedArticles({ articles, currentArticleId }: RelatedArticlesProps) {
  const relatedArticles = articles
    .filter(article => article.id !== currentArticleId)
    .slice(0, 3);

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
      <div className="space-y-6">
        {relatedArticles.map((article) => (
          <article key={article.id} className="group">
            <Link to={`/g/news/${article.slug}`} className="flex space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-24 h-24 object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-blue-600">{article.category}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">{article.readTime} min read</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                  {article.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
