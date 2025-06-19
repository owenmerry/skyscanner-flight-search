import { Link } from "@remix-run/react";

interface NewsCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    imageUrl: string;
    category: string;
    publishedAt: string;
    slug: string;
    author: string;
    readTime: number;
  };
  featured?: boolean;
}

export function NewsCard({ article, featured = false }: NewsCardProps) {
  const cardClass = featured
    ? "group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2 md:row-span-2"
    : "group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300";

  const imageClass = featured
    ? "w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
    : "w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300";

  const titleClass = featured
    ? "text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors"
    : "text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors";

  return (
    <article className={cardClass}>
      <Link to={`/g/news/${article.slug}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className={imageClass}
          />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
              {article.category}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className={titleClass}>
            {article.title}
          </h2>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>By {article.author}</span>
              <span>•</span>
              <span>{article.readTime} min read</span>
            </div>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}
