import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

// This is a placeholder API route for Contentful integration
// Replace with actual Contentful API calls once configured

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const featured = url.searchParams.get("featured");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const skip = parseInt(url.searchParams.get("skip") || "0");

  // This would be replaced with actual Contentful API calls
  // Example using the search_entries function:
  
  /*
  try {
    const query: any = {
      content_type: "newsArticle",
      limit,
      skip,
      order: "-fields.publishedAt"
    };

    if (category) {
      query.query = `fields.category[match]=${category}`;
    }

    if (featured === "true") {
      query.query = (query.query ? query.query + " AND " : "") + "fields.featured=true";
    }

    const response = await search_entries({
      query,
      spaceId: process.env.CONTENTFUL_SPACE_ID!,
      environmentId: "master"
    });

    const articles = response.items.map(transformContentfulArticle);

    return json({
      items: articles,
      total: response.total,
      skip: response.skip,
      limit: response.limit
    });
  } catch (error) {
    console.error("Contentful API error:", error);
    return json({ error: "Failed to fetch articles" }, { status: 500 });
  }
  */

  // Fallback to mock data for now
  const { mockArticles } = await import("~/components/g/newsData");
  
  let filteredArticles = mockArticles;
  
  if (category) {
    filteredArticles = filteredArticles.filter(
      article => article.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (featured === "true") {
    filteredArticles = filteredArticles.slice(0, 3); // Mock featured articles
  }

  const paginatedArticles = filteredArticles.slice(skip, skip + limit);

  return json({
    items: paginatedArticles,
    total: filteredArticles.length,
    skip,
    limit
  });
}

// Helper function to transform Contentful articles (for when Contentful is integrated)
function transformContentfulArticle(contentfulArticle: any) {
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
