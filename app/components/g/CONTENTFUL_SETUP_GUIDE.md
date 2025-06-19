# Contentful Integration Setup Guide

This guide will help you integrate the NewsHub website with Contentful CMS to replace the mock data with real content management.

## Prerequisites

1. **Contentful Account**: Sign up at [contentful.com](https://www.contentful.com)
2. **Space Created**: Create a new space in Contentful
3. **API Keys**: Obtain your Space ID and Content Management API token

## Step 1: Create Content Type in Contentful

### News Article Content Type

1. Go to your Contentful space
2. Navigate to **Content model** → **Add content type**
3. Name: `News Article`
4. API Identifier: `newsArticle`
5. Description: `A news article with rich content and metadata`

### Add Fields

Create these fields in the following order:

#### 1. Title (Short text)
- **Field ID**: `title`
- **Field name**: `Title`
- **Help text**: `The main headline of the article`
- **Validation**: Required, Character limit: 200
- **Appearance**: Single line

#### 2. Slug (Short text)
- **Field ID**: `slug`
- **Field name**: `URL Slug`
- **Help text**: `URL-friendly version of the title`
- **Validation**: Required, Unique, Match pattern: `^[a-z0-9-]+$`
- **Appearance**: Slug

#### 3. Excerpt (Long text)
- **Field ID**: `excerpt`
- **Field name**: `Excerpt`
- **Help text**: `Brief summary for previews and SEO`
- **Validation**: Required, Character limit: 500
- **Appearance**: Multiple line

#### 4. Content (Rich text)
- **Field ID**: `content`
- **Field name**: `Article Content`
- **Help text**: `The main article content`
- **Validation**: Required
- **Appearance**: Rich text editor

#### 5. Featured Image (Media)
- **Field ID**: `featuredImage`
- **Field name**: `Featured Image`
- **Help text**: `Main image for the article`
- **Validation**: Required, Accept only specified file types: Images
- **Appearance**: Single media

#### 6. Category (Short text)
- **Field ID**: `category`
- **Field name**: `Category`
- **Help text**: `News category`
- **Validation**: Required, Accept only specified values:
  - `World`
  - `Politics`
  - `Business`
  - `Technology`
  - `Sports`
  - `Entertainment`
  - `Health`
- **Appearance**: Dropdown

#### 7. Author (Short text)
- **Field ID**: `author`
- **Field name**: `Author`
- **Help text**: `Article author name`
- **Validation**: Required
- **Appearance**: Single line

#### 8. Published At (Date and time)
- **Field ID**: `publishedAt`
- **Field name**: `Published Date`
- **Help text**: `When the article was published`
- **Validation**: Required
- **Appearance**: Date and time

#### 9. Read Time (Integer)
- **Field ID**: `readTime`
- **Field name**: `Read Time (minutes)`
- **Help text**: `Estimated reading time in minutes`
- **Validation**: Required, Accept only specified values: 1-60
- **Appearance**: Number editor

#### 10. Tags (Short text, list)
- **Field ID**: `tags`
- **Field name**: `Tags`
- **Help text**: `Article tags for categorization`
- **Validation**: None
- **Appearance**: Tags

#### 11. SEO Title (Short text)
- **Field ID**: `seoTitle`
- **Field name**: `SEO Title`
- **Help text**: `Custom title for search engines (60 chars max)`
- **Validation**: Character limit: 60
- **Appearance**: Single line

#### 12. SEO Description (Long text)
- **Field ID**: `seoDescription`
- **Field name**: `SEO Description`
- **Help text**: `Custom description for search engines (160 chars max)`
- **Validation**: Character limit: 160
- **Appearance**: Multiple line

#### 13. Featured (Boolean)
- **Field ID**: `featured`
- **Field name**: `Featured Article`
- **Help text**: `Mark as featured on homepage`
- **Validation**: None
- **Appearance**: Boolean

### Set Display Field
Set **Title** as the display field for the content type.

## Step 2: Environment Variables

Add these environment variables to your `.env` file:

```env
# Contentful Configuration
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_content_delivery_api_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_api_token
CONTENTFUL_MANAGEMENT_TOKEN=your_management_api_token
CONTENTFUL_ENVIRONMENT=master
```

## Step 3: Update Code to Use Contentful

### Replace Mock Data in Loaders

#### Homepage (`news._index.tsx`)
```typescript
import ContentfulService from "~/components/g/ContentfulService";

export async function loader() {
  const contentfulService = new ContentfulService(
    process.env.CONTENTFUL_SPACE_ID!,
    process.env.CONTENTFUL_ENVIRONMENT!
  );

  const [featuredArticles, allArticles] = await Promise.all([
    contentfulService.getFeaturedArticles(),
    contentfulService.getAllArticles()
  ]);

  const categories = [
    { name: "World News", slug: "world", articles: await contentfulService.getArticlesByCategory("World") },
    { name: "Technology", slug: "technology", articles: await contentfulService.getArticlesByCategory("Technology") },
    // ... other categories
  ];

  return json({ featuredArticles, categories });
}
```

#### Article Page (`news.$slug.tsx`)
```typescript
export async function loader({ params }: LoaderFunctionArgs) {
  const contentfulService = new ContentfulService(
    process.env.CONTENTFUL_SPACE_ID!,
    process.env.CONTENTFUL_ENVIRONMENT!
  );

  const article = await contentfulService.getArticleBySlug(params.slug!);
  if (!article) {
    throw new Response("Not Found", { status: 404 });
  }

  const relatedArticles = await contentfulService.getRelatedArticles(
    article.id,
    article.category,
    article.tags
  );

  return json({ article, relatedArticles });
}
```

#### Category Page (`news.category.$category.tsx`)
```typescript
export async function loader({ params }: LoaderFunctionArgs) {
  const contentfulService = new ContentfulService(
    process.env.CONTENTFUL_SPACE_ID!,
    process.env.CONTENTFUL_ENVIRONMENT!
  );

  const articles = await contentfulService.getArticlesByCategory(categoryName);
  
  return json({ category, categoryName, articles });
}
```

## Step 4: Create Sample Content

### Sample Articles

Create at least 6-10 sample articles covering different categories:

1. **Breaking News Article** (World)
   - Title: "Global Climate Summit Reaches Historic Agreement"
   - Category: World
   - Featured: true

2. **Tech Article** (Technology)
   - Title: "AI Revolution Transforms Healthcare Industry"
   - Category: Technology

3. **Business Article** (Business)
   - Title: "Stock Markets Surge Following Economic Report"
   - Category: Business

4. **Sports Article** (Sports)
   - Title: "Championship Victory Sparks City-Wide Celebration"
   - Category: Sports

### Sample Images
Use high-quality images from:
- [Unsplash](https://unsplash.com)
- [Pexels](https://pexels.com)
- Make sure images are at least 800x600px

## Step 5: Test Integration

### Contentful Tools
```bash
# Install Contentful CLI
npm install -g contentful-cli

# Login to Contentful
contentful login

# Export your space structure
contentful space export --space-id YOUR_SPACE_ID
```

### Verify API Responses
1. Test the Content Delivery API:
   ```
   https://cdn.contentful.com/spaces/YOUR_SPACE_ID/entries?content_type=newsArticle
   ```

2. Check individual articles:
   ```
   https://cdn.contentful.com/spaces/YOUR_SPACE_ID/entries?content_type=newsArticle&fields.slug=your-article-slug
   ```

## Step 6: Update Contentful Service Functions

The `ContentfulService.ts` file contains placeholder functions. Update them to use the actual Contentful tools:

```typescript
// Example: Get all articles
async getAllArticles(): Promise<Article[]> {
  const response = await search_entries({
    query: {
      content_type: "newsArticle",
      limit: 100,
      order: "-fields.publishedAt"
    },
    spaceId: this.spaceId,
    environmentId: this.environmentId
  });

  return response.items.map(item => this.transformArticle(item));
}
```

## Step 7: Deploy and Monitor

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Contentful content types created
- [ ] Sample content added
- [ ] Code updated to use Contentful
- [ ] All pages tested
- [ ] SEO meta tags working
- [ ] RSS feed updated
- [ ] Sitemap includes all articles

### Monitoring
1. **Content Delivery**: Monitor API response times
2. **Cache Strategy**: Implement caching for better performance
3. **Error Handling**: Log Contentful API errors
4. **Content Preview**: Set up preview URLs for editors

## Step 8: Content Management Workflow

### For Content Editors
1. **Create Article**: Use Contentful web interface
2. **Preview**: Use preview URLs before publishing
3. **Publish**: Content appears on live site immediately
4. **Update**: Changes reflect in real-time

### Editorial Guidelines
- Headlines: 50-60 characters for SEO
- Excerpts: 150-300 characters
- Images: High-quality, properly sized
- Tags: 3-5 relevant tags per article
- SEO fields: Always fill for better search visibility

## Troubleshooting

### Common Issues

1. **API Errors**
   - Check space ID and access tokens
   - Verify content type exists
   - Check rate limits

2. **Missing Content**
   - Ensure content is published
   - Check field names match exactly
   - Verify environment (master vs. preview)

3. **Image Issues**
   - Check asset permissions
   - Verify image formats (JPEG, PNG, WebP)
   - Ensure proper image optimization

### Support Resources
- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Content Management API](https://www.contentful.com/developers/docs/references/content-management-api/)
- [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/)

This setup provides a robust, scalable news website with professional content management capabilities.
