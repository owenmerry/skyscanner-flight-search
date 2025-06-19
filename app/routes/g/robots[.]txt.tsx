import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const baseUrl = `${protocol}://${host}`;

  const robotsTxt = `User-agent: *
Allow: /

# News content
Allow: /g/news/
Allow: /g/news/category/
Allow: /g/news/sitemap.xml

# Block admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_private/

# Sitemap location
Sitemap: ${baseUrl}/g/sitemap.xml

# Crawl delay (optional, for high-traffic sites)
Crawl-delay: 1`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    }
  });
}
