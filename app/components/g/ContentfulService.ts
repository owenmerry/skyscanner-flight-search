// ContentfulService.ts - Updated for actual Contentful integration
import type { Article } from "./newsData";

// Contentful Content Types
interface ContentfulAsset {
  sys: { id: string };
  fields: {
    title: string;
    file: {
      url: string;
    };
  };
}

interface ContentfulArticle {
  sys: { id: string; createdAt: string; updatedAt: string };
  fields: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: ContentfulAsset;
    category: string;
    author: string;
    publishedAt: string;
    readTime: number;
    tags: string[];
    seoTitle?: string;
    seoDescription?: string;
    featured?: boolean;
  };
}

class ContentfulService {
  private spaceId: string;
  private environmentId: string;

  constructor(spaceId: string = "your-space-id", environmentId: string = "master") {
    this.spaceId = spaceId;
    this.environmentId = environmentId;
  }

  // Convert Contentful article to our Article interface
  private transformArticle(contentfulArticle: ContentfulArticle): Article {
    const { sys, fields } = contentfulArticle;
    return {
      id: sys.id,
      title: fields.title,
      excerpt: fields.excerpt,
      content: fields.content,
      imageUrl: fields.featuredImage ? `https:${fields.featuredImage.fields.file.url}` : "",
      category: fields.category,
      publishedAt: fields.publishedAt || sys.createdAt,
      slug: fields.slug,
      author: fields.author,
      readTime: fields.readTime,
      tags: fields.tags || [],
      seoTitle: fields.seoTitle,
      seoDescription: fields.seoDescription,
    };
  }

  // Get all articles
  async getAllArticles(): Promise<Article[]> {
    try {
      // Using the search_entries function from your Contentful tools
      const response = await search_entries({
        query: {
          content_type: "newsArticle",
          limit: 100,
          skip: 0,
          order: "-fields.publishedAt"
        },
        spaceId: this.spaceId,
        environmentId: this.environmentId
      });
      
      return response.items.map((item: ContentfulArticle) => this.transformArticle(item));
    } catch (error) {
      console.error("Error fetching articles from Contentful:", error);
      // Fallback to mock data if Contentful fails
      const { mockArticles } = await import("./newsData");
      return mockArticles;
    }
  }

  // Get articles by category
  async getArticlesByCategory(category: string): Promise<Article[]> {
    try {
      const response = await search_entries({
        query: {
          content_type: "newsArticle",
          limit: 20,
          skip: 0,
          query: `fields.category[match]=${category}`,
          order: "-fields.publishedAt"
        },
        spaceId: this.spaceId,
        environmentId: this.environmentId
      });
      
      return response.items.map((item: ContentfulArticle) => this.transformArticle(item));
    } catch (error) {
      console.error("Error fetching articles by category from Contentful:", error);
      const { getArticlesByCategory } = await import("./newsData");
      return getArticlesByCategory(category);
    }
  }

  // Get single article by slug
  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const response = await search_entries({
        query: {
          content_type: "newsArticle",
          limit: 1,
          skip: 0,
          query: `fields.slug[match]=${slug}`
        },
        spaceId: this.spaceId,
        environmentId: this.environmentId
      });
      
      if (response.items.length === 0) return null;
      
      return this.transformArticle(response.items[0] as ContentfulArticle);
    } catch (error) {
      console.error("Error fetching article by slug from Contentful:", error);
      const { getArticleBySlug } = await import("./newsData");
      return getArticleBySlug(slug) || null;
    }
  }

  // Get featured articles
  async getFeaturedArticles(): Promise<Article[]> {
    try {
      const response = await search_entries({
        query: {
          content_type: "newsArticle",
          limit: 3,
          skip: 0,
          query: "fields.featured=true",
          order: "-fields.publishedAt"
        },
        spaceId: this.spaceId,
        environmentId: this.environmentId
      });
      
      return response.items.map((item: ContentfulArticle) => this.transformArticle(item));
    } catch (error) {
      console.error("Error fetching featured articles from Contentful:", error);
      const { getFeaturedArticles } = await import("./newsData");
      return getFeaturedArticles();
    }
  }

  // Get related articles
  async getRelatedArticles(currentArticleId: string, category: string, tags: string[]): Promise<Article[]> {
    try {
      // First try to get articles from the same category
      const response = await search_entries({
        query: {
          content_type: "newsArticle",
          limit: 6,
          skip: 0,
          query: `fields.category[match]=${category} AND NOT sys.id=${currentArticleId}`,
          order: "-fields.publishedAt"
        },
        spaceId: this.spaceId,
        environmentId: this.environmentId
      });
      
      const articles = response.items.map((item: ContentfulArticle) => this.transformArticle(item));
      return articles.slice(0, 3);
    } catch (error) {
      console.error("Error fetching related articles from Contentful:", error);
      const { getRelatedArticles, mockArticles } = await import("./newsData");
      const currentArticle = mockArticles.find(a => a.id === currentArticleId);
      return currentArticle ? getRelatedArticles(currentArticle) : [];
    }
  }

  // Get top stories (most recent articles)
  async getTopStories(): Promise<Article[]> {
    try {
      const response = await search_entries({
        query: {
          content_type: "newsArticle",
          limit: 4,
          skip: 0,
          order: "-fields.publishedAt"
        },
        spaceId: this.spaceId,
        environmentId: this.environmentId
      });
      
      return response.items.map((item: ContentfulArticle) => this.transformArticle(item));
    } catch (error) {
      console.error("Error fetching top stories from Contentful:", error);
      const { getTopStories } = await import("./newsData");
      return getTopStories();
    }
  }
}

// Content Type Definition for Contentful
export const newsArticleContentType = {
  name: "News Article",
  description: "A news article with rich content and metadata",
  displayField: "title",
  fields: [
    {
      id: "title",
      name: "Title",
      type: "Symbol" as const,
      required: true,
      validations: [{ size: { max: 200 } }]
    },
    {
      id: "slug",
      name: "Slug",
      type: "Symbol" as const,
      required: true,
      validations: [{ unique: true }]
    },
    {
      id: "excerpt",
      name: "Excerpt", 
      type: "Text" as const,
      required: true,
      validations: [{ size: { max: 500 } }]
    },
    {
      id: "content",
      name: "Content",
      type: "Text" as const,
      required: true
    },
    {
      id: "featuredImage",
      name: "Featured Image",
      type: "Link" as const,
      linkType: "Asset" as const,
      required: true
    },
    {
      id: "category",
      name: "Category",
      type: "Symbol" as const,
      required: true,
      validations: [{
        in: ["World", "Politics", "Business", "Technology", "Sports", "Entertainment", "Health"]
      }]
    },
    {
      id: "author",
      name: "Author",
      type: "Symbol" as const,
      required: true
    },
    {
      id: "publishedAt",
      name: "Published At",
      type: "Date" as const,
      required: true
    },
    {
      id: "readTime",
      name: "Read Time (minutes)",
      type: "Integer" as const,
      required: true,
      validations: [{ range: { min: 1, max: 60 } }]
    },
    {
      id: "tags",
      name: "Tags",
      type: "Array" as const,
      items: {
        type: "Symbol" as const,
        validations: [{ size: { max: 50 } }]
      }
    },
    {
      id: "seoTitle",
      name: "SEO Title",
      type: "Symbol" as const,
      validations: [{ size: { max: 60 } }]
    },
    {
      id: "seoDescription", 
      name: "SEO Description",
      type: "Text" as const,
      validations: [{ size: { max: 160 } }]
    },
    {
      id: "featured",
      name: "Featured Article",
      type: "Boolean" as const
    }
  ]
};

export default ContentfulService;

// Helper functions to use in your routes
export async function getContentfulService() {
  // You can set these environment variables or get them from your config
  const spaceId = process.env.CONTENTFUL_SPACE_ID || "your-space-id";
  const environmentId = process.env.CONTENTFUL_ENVIRONMENT || "master";
  
  return new ContentfulService(spaceId, environmentId);
}
