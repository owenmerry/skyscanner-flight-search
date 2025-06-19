import type { Article } from "./newsData";

interface StructuredDataProps {
  type: "website" | "article" | "organization";
  data?: {
    article?: Article;
    url?: string;
  };
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://newshub.com";
    
    switch (type) {
      case "website":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "NewsHub",
          "alternateName": "NewsHub - Breaking News",
          "url": `${baseUrl}/g/news`,
          "description": "Stay informed with the latest breaking news, top stories, and in-depth coverage across world events, politics, business, technology, sports, and entertainment.",
          "publisher": {
            "@type": "Organization",
            "name": "NewsHub",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`,
              "width": 200,
              "height": 60
            }
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/g/news/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        };

      case "article":
        if (!data?.article) return null;
        
        const article = data.article;
        return {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": article.title,
          "description": article.excerpt,
          "image": {
            "@type": "ImageObject",
            "url": article.imageUrl,
            "width": 800,
            "height": 600
          },
          "datePublished": article.publishedAt,
          "dateModified": article.publishedAt,
          "author": {
            "@type": "Person",
            "name": article.author,
            "url": `${baseUrl}/g/news/author/${article.author.toLowerCase().replace(/\s+/g, '-')}`
          },
          "publisher": {
            "@type": "Organization",
            "name": "NewsHub",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`,
              "width": 200,
              "height": 60
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${baseUrl}/g/news/${article.slug}`
          },
          "articleSection": article.category,
          "keywords": article.tags.join(", "),
          "wordCount": article.content.replace(/<[^>]*>/g, "").split(" ").length,
          "timeRequired": `PT${article.readTime}M`,
          "url": `${baseUrl}/g/news/${article.slug}`,
          "isAccessibleForFree": true,
          "hasPart": {
            "@type": "WebPageElement",
            "@id": `${baseUrl}/g/news/${article.slug}#article-body`,
            "isAccessibleForFree": true,
            "cssSelector": ".article-content"
          }
        };

      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "NewsMediaOrganization",
          "name": "NewsHub",
          "alternateName": "NewsHub News",
          "url": `${baseUrl}/g/news`,
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo.png`,
            "width": 200,
            "height": 60
          },
          "description": "NewsHub is a trusted source for breaking news, in-depth analysis, and comprehensive coverage of global events.",
          "sameAs": [
            "https://twitter.com/newshub",
            "https://facebook.com/newshub",
            "https://linkedin.com/company/newshub"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-NEWS-HUB",
            "contactType": "Editorial",
            "email": "editorial@newshub.com"
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 News Street",
            "addressLocality": "New York",
            "addressRegion": "NY",
            "postalCode": "10001",
            "addressCountry": "US"
          },
          "foundingDate": "2020-01-01",
          "knowsAbout": [
            "Breaking News",
            "World Events", 
            "Politics",
            "Business",
            "Technology",
            "Sports",
            "Entertainment",
            "Health"
          ],
          "publishingPrinciples": `${baseUrl}/g/news/about/editorial-guidelines`,
          "correctionsPolicy": `${baseUrl}/g/news/about/corrections-policy`,
          "diversityPolicy": `${baseUrl}/g/news/about/diversity-policy`,
          "ethicsPolicy": `${baseUrl}/g/news/about/ethics-policy`
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();
  
  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}

// Breadcrumb structured data component
interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}

// FAQ structured data component (for category pages)
interface FAQStructuredDataProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}
