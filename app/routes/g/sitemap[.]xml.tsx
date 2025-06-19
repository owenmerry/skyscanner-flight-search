import type { LoaderFunctionArgs } from "@remix-run/node";
import ContentfulService from "~/components/g/ContentfulService";

export async function loader({ request }: LoaderFunctionArgs) {
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const baseUrl = `${protocol}://${host}`;

  const contentfulService = new ContentfulService(
    process.env.CONTENTFUL_SPACE_ID,
    process.env.CONTENTFUL_ENVIRONMENT || "master"
  );

  let articles;
  try {
    // Try to get articles from Contentful
    articles = await contentfulService.getAllArticles();
  } catch (error) {
    console.error("Error fetching articles for sitemap:", error);
    // Fallback to mock data
    const { mockArticles } = await import("~/components/g/newsData");
    articles = mockArticles;
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/g/news</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  
  <!-- Category Pages -->
  <url>
    <loc>${baseUrl}/g/news/category/world</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/g/news/category/politics</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/g/news/category/business</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/g/news/category/technology</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/g/news/category/sports</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/g/news/category/entertainment</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/g/news/category/health</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>

  <!-- Search Page -->
  <url>
    <loc>${baseUrl}/g/news/search</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>

  <!-- Article Pages -->
  ${articles.map(article => `  <url>
    <loc>${baseUrl}/g/news/${article.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date(article.publishedAt).toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      "encoding": "UTF-8"
    }
  });
}
