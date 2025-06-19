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

  let allArticles;
  try {
    // Try to get articles from Contentful
    allArticles = await contentfulService.getAllArticles();
  } catch (error) {
    console.error("Error fetching articles for RSS:", error);
    // Fallback to mock data
    const { mockArticles } = await import("~/components/g/newsData");
    allArticles = mockArticles;
  }

  // Get the latest 20 articles for the RSS feed
  const latestArticles = allArticles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 20);

  const rssItems = latestArticles.map(article => {
    const pubDate = new Date(article.publishedAt).toUTCString();
    const articleUrl = `${baseUrl}/g/news/${article.slug}`;
    
    return `    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description><![CDATA[${article.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>${article.author}</author>
      <category>${article.category}</category>
      <enclosure url="${article.imageUrl}" type="image/jpeg" />
      ${article.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join('\n      ')}
    </item>`;
  }).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NewsHub - Latest Breaking News</title>
    <link>${baseUrl}/g/news</link>
    <description>Stay informed with the latest breaking news, top stories, and in-depth coverage across world events, politics, business, technology, sports, and entertainment.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>NewsHub RSS Generator</generator>
    <webMaster>editor@newshub.com (NewsHub Editorial Team)</webMaster>
    <managingEditor>editor@newshub.com (NewsHub Editorial Team)</managingEditor>
    <copyright>Copyright ${new Date().getFullYear()} NewsHub. All rights reserved.</copyright>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>NewsHub</title>
      <link>${baseUrl}/g/news</link>
      <width>144</width>
      <height>144</height>
    </image>
    <atom:link href="${baseUrl}/g/rss.xml" rel="self" type="application/rss+xml" />
    
${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    }
  });
}
