import { Link } from "@remix-run/react";
import { NewsCard } from "./NewsCard";

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

interface CategorySectionProps {
  title: string;
  articles: Article[];
  categorySlug: string;
  showAll?: boolean;
}

export function CategorySection({ title, articles, categorySlug, showAll = false }: CategorySectionProps) {
  const displayedArticles = showAll ? articles : articles.slice(0, 4);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        {!showAll && articles.length > 4 && (
          <Link
            to={`/g/news/category/${categorySlug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            View all
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedArticles.map((article, index) => (
          <NewsCard
            key={article.id}
            article={article}
            featured={index === 0 && !showAll}
          />
        ))}
      </div>
    </section>
  );
}
