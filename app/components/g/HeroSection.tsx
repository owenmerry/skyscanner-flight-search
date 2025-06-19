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

interface HeroSectionProps {
  featuredArticle: Article;
  topStories: Article[];
}

export function HeroSection({ featuredArticle, topStories }: HeroSectionProps) {
  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Article */}
        <div className="lg:col-span-2">
          <article className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Link to={`/g/news/${featuredArticle.slug}`} className="block">
              <div className="relative overflow-hidden">
                <img
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  className="w-full h-80 md:h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-600 text-white">
                    Breaking News
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                    {featuredArticle.title}
                  </h1>
                  <p className="text-gray-200 mb-4 line-clamp-2">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-300">
                    <span>By {featuredArticle.author}</span>
                    <span className="mx-2">•</span>
                    <span>{featuredArticle.readTime} min read</span>
                    <span className="mx-2">•</span>
                    <time dateTime={featuredArticle.publishedAt}>
                      {new Date(featuredArticle.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        </div>

        {/* Top Stories Sidebar */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2">
            Top Stories
          </h2>
          {topStories.map((story, index) => (
            <article key={story.id} className="group">
              <Link to={`/g/news/${story.slug}`} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-20 h-20 object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-blue-600">{story.category}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(story.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {story.title}
                  </h3>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
