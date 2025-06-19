# Contentful Setup Script

This script will help you set up your Contentful space with the news article content type and sample data.

## Prerequisites

1. **Contentful Account**: Create account at [contentful.com](https://www.contentful.com)
2. **Space Created**: Create a new space in your Contentful account
3. **API Keys**: Get your Space ID and Management API token

## Step 1: Get Your Contentful Credentials

### Space ID
1. Go to your Contentful space
2. Go to **Settings** → **General settings**
3. Copy your **Space ID**

### Management API Token
1. Go to **Settings** → **API keys**
2. Click **Content management tokens**
3. Click **Generate personal token**
4. Copy the token (save it securely!)

### Content Delivery API Token
1. Go to **Settings** → **API keys**
2. Find or create a content delivery API key
3. Copy the **Content Delivery API - access token**

## Step 2: Environment Variables

Add these to your `.env` file:

```env
# Replace with your actual values
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token_here
CONTENTFUL_ACCESS_TOKEN=your_content_delivery_token_here
CONTENTFUL_ENVIRONMENT=master
```

## Step 3: Manual Content Type Creation

Since the Contentful API isn't currently accessible, you'll need to create the content type manually:

### Create "News Article" Content Type

1. **Go to Content Model** in your Contentful space
2. **Click "Add content type"**
3. **Set details:**
   - Name: `News Article`
   - API Identifier: `newsArticle`
   - Description: `A news article with rich content and metadata`

### Add These Fields (in order):

#### 1. Title
- **Type**: Short text
- **Field ID**: `title`
- **Validations**: Required, Max 200 characters
- **Appearance**: Single line

#### 2. Slug  
- **Type**: Short text
- **Field ID**: `slug`
- **Validations**: Required, Unique
- **Appearance**: Slug

#### 3. Excerpt
- **Type**: Long text
- **Field ID**: `excerpt`
- **Validations**: Required, Max 500 characters
- **Appearance**: Multiple line

#### 4. Content
- **Type**: Rich text
- **Field ID**: `content`
- **Validations**: Required
- **Appearance**: Rich text editor

#### 5. Featured Image
- **Type**: Media
- **Field ID**: `featuredImage`
- **Validations**: Required, Images only
- **Appearance**: Single media

#### 6. Category
- **Type**: Short text
- **Field ID**: `category`
- **Validations**: Required, Predefined values:
  - `World`
  - `Politics`
  - `Business`
  - `Technology`
  - `Sports`
  - `Entertainment`
  - `Health`
- **Appearance**: Dropdown

#### 7. Author
- **Type**: Short text
- **Field ID**: `author`
- **Validations**: Required
- **Appearance**: Single line

#### 8. Published At
- **Type**: Date and time
- **Field ID**: `publishedAt`
- **Validations**: Required
- **Appearance**: Date picker

#### 9. Read Time
- **Type**: Integer
- **Field ID**: `readTime`
- **Validations**: Required, Range 1-60
- **Appearance**: Number editor

#### 10. Tags
- **Type**: Short text, list
- **Field ID**: `tags`
- **Validations**: None
- **Appearance**: Tags

#### 11. SEO Title
- **Type**: Short text
- **Field ID**: `seoTitle`
- **Validations**: Max 60 characters
- **Appearance**: Single line

#### 12. SEO Description
- **Type**: Long text
- **Field ID**: `seoDescription`
- **Validations**: Max 160 characters
- **Appearance**: Multiple line

#### 13. Featured
- **Type**: Boolean
- **Field ID**: `featured`
- **Validations**: None
- **Appearance**: Boolean

### Set Display Field
- Set **Title** as the display field

## Step 4: Create Sample Articles

Create these sample articles in your Contentful space:

### Article 1: Global Climate Summit
```
Title: Global Climate Summit Reaches Historic Agreement on Carbon Emissions
Slug: global-climate-summit-historic-agreement
Category: World
Author: Michael Rodriguez
Published At: 2025-06-11T10:00:00Z
Read Time: 8
Featured: true
Excerpt: World leaders unite in unprecedented commitment to reduce global carbon emissions by 50% within the next decade.
Tags: climate change, environment, politics, international
SEO Title: Historic Climate Agreement: 195 Countries Commit to 50% Emission Cuts
Content: (Rich text with full article content)
```

### Article 2: AI Healthcare Platform
```
Title: Tech Giants Unveil Revolutionary AI-Powered Healthcare Platform
Slug: tech-giants-ai-healthcare-platform
Category: Technology
Author: Dr. Lisa Wang
Published At: 2025-06-11T08:30:00Z
Read Time: 6
Featured: false
Excerpt: Major technology companies collaborate to launch an AI platform that could transform medical diagnosis and treatment worldwide.
Tags: technology, healthcare, AI, innovation
Content: (Rich text with full article content)
```

### Article 3: Stock Market Surge
```
Title: Stock Markets Surge Following Federal Reserve Interest Rate Decision
Slug: stock-markets-surge-fed-rate-decision
Category: Business
Author: Robert Chen
Published At: 2025-06-11T07:15:00Z
Read Time: 4
Featured: true
Excerpt: Major indices reach record highs as investors react positively to the Federal Reserve's latest monetary policy announcement.
Tags: finance, stocks, federal reserve, economy
Content: (Rich text with full article content)
```

### Article 4: Championship Victory
```
Title: Championship Victory: Local Team Makes History in National Finals
Slug: championship-victory-eagles-national-finals
Category: Sports
Author: Sarah Johnson
Published At: 2025-06-10T22:00:00Z
Read Time: 5
Featured: false
Excerpt: Against all odds, the underdog team secures their first national championship in a thrilling overtime victory.
Tags: sports, championship, football, victory
Content: (Rich text with full article content)
```

### Article 5: Medical Breakthrough
```
Title: Breakthrough Medical Study Shows Promise for Alzheimer's Treatment
Slug: alzheimers-treatment-breakthrough-study
Category: Health
Author: Dr. Emily Foster
Published At: 2025-06-10T14:30:00Z
Read Time: 7
Featured: true
Excerpt: New research reveals significant improvements in cognitive function among patients receiving experimental treatment.
Tags: health, medical research, alzheimers, breakthrough
Content: (Rich text with full article content)
```

### Article 6: Hollywood Awards
```
Title: Hollywood Stars Shine at Annual Awards Ceremony
Slug: hollywood-awards-ceremony-golden-stars
Category: Entertainment
Author: Amanda Roberts
Published At: 2025-06-10T11:00:00Z
Read Time: 3
Featured: false
Excerpt: The entertainment industry's biggest night celebrates outstanding achievements in film and television.
Tags: entertainment, awards, hollywood, celebrities
Content: (Rich text with full article content)
```

## Step 5: Add Images

For each article, upload high-quality images from:
- [Unsplash](https://unsplash.com) (free, commercial use)
- [Pexels](https://pexels.com) (free, commercial use)

Recommended image sizes: 800x600px minimum

## Step 6: Publish Content

1. **Save each article as Draft**
2. **Publish the content type** (Content model → Actions → Publish)
3. **Publish each article** (Content → Select article → Publish)

## Step 7: Test Integration

Once you have:
- ✅ Content type created
- ✅ Sample articles added
- ✅ Environment variables set
- ✅ Content published

Your website should automatically load content from Contentful!

## Verification

1. **Check API Response**:
   ```
   https://cdn.contentful.com/spaces/YOUR_SPACE_ID/entries?content_type=newsArticle
   ```

2. **Test Website**:
   - Visit `/g/news` to see homepage with Contentful data
   - Click on articles to verify they load
   - Check categories work properly

## Troubleshooting

### Common Issues:

1. **No content showing**: Check that articles are published
2. **API errors**: Verify space ID and tokens are correct
3. **Field errors**: Ensure field IDs match exactly (`newsArticle`, not `news-article`)
4. **Image issues**: Make sure images are published assets

### Support

If you encounter issues:
1. Check Contentful's API documentation
2. Verify environment variables are loaded
3. Check browser console for specific error messages
4. Ensure content is published (not just saved as draft)

## Content Management Workflow

Once set up:
1. **Create articles** in Contentful web interface
2. **Articles automatically appear** on your website
3. **Edit anytime** - changes reflect immediately
4. **SEO fields** help optimize search visibility
5. **Categories and tags** organize content

Your news website now has a professional CMS! 🎉
