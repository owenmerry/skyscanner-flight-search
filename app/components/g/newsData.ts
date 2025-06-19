// Mock data - this would be replaced with Contentful data
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
  slug: string;
  author: string;
  readTime: number;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "Global Climate Summit Reaches Historic Agreement on Carbon Emissions",
    excerpt: "World leaders unite in unprecedented commitment to reduce global carbon emissions by 50% within the next decade.",
    content: `<p>In a landmark decision that could reshape the global response to climate change, representatives from 195 countries have reached a historic agreement at this year's Global Climate Summit. The accord, dubbed the "Global Carbon Compact," commits signatory nations to reducing their carbon emissions by 50% within the next decade.</p>
    
    <p>The agreement, which was months in the making, represents the most ambitious climate action plan ever adopted on a global scale. Unlike previous climate accords, this compact includes binding commitments with financial penalties for countries that fail to meet their targets.</p>
    
    <p>"This is a defining moment for humanity," said Dr. Sarah Chen, lead climate negotiator for the United Nations. "For the first time, we have unanimous agreement on the urgent need for action, backed by concrete commitments and accountability measures."</p>
    
    <h2>Key Provisions of the Agreement</h2>
    
    <p>The Global Carbon Compact includes several groundbreaking provisions:</p>
    
    <ul>
      <li>Mandatory 50% reduction in carbon emissions by 2034</li>
      <li>$500 billion global fund for clean energy transition</li>
      <li>Binding annual reporting requirements</li>
      <li>Financial penalties for non-compliance</li>
      <li>Technology sharing agreements between developed and developing nations</li>
    </ul>
    
    <p>The agreement also establishes a new International Climate Monitoring Agency, which will have unprecedented authority to track emissions and enforce compliance across all participating nations.</p>`,
    imageUrl: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&q=80",
    category: "World",
    publishedAt: "2025-06-11T10:00:00Z",
    slug: "global-climate-summit-historic-agreement",
    author: "Michael Rodriguez",
    readTime: 8,
    tags: ["climate change", "environment", "politics", "international"],
    seoTitle: "Historic Climate Agreement: 195 Countries Commit to 50% Emission Cuts",
    seoDescription: "Breaking: Global Climate Summit achieves unprecedented agreement with 195 countries committing to 50% carbon emission reductions by 2034."
  },
  {
    id: "2", 
    title: "Tech Giants Unveil Revolutionary AI-Powered Healthcare Platform",
    excerpt: "Major technology companies collaborate to launch an AI platform that could transform medical diagnosis and treatment worldwide.",
    content: `<p>In an unprecedented collaboration, five of the world's largest technology companies have joined forces to launch MedAI, a revolutionary artificial intelligence platform designed to transform healthcare delivery globally.</p>
    
    <p>The platform, which combines machine learning algorithms with vast medical databases, promises to provide instant diagnostic assistance to healthcare providers worldwide, potentially saving millions of lives through faster and more accurate medical interventions.</p>`,
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
    category: "Technology",
    publishedAt: "2025-06-11T08:30:00Z",
    slug: "tech-giants-ai-healthcare-platform",
    author: "Dr. Lisa Wang",
    readTime: 6,
    tags: ["technology", "healthcare", "AI", "innovation"],
    seoTitle: "Tech Giants Launch Revolutionary AI Healthcare Platform - MedAI",
    seoDescription: "Major tech companies unveil MedAI, an AI-powered healthcare platform set to transform medical diagnosis and treatment worldwide."
  },
  {
    id: "3",
    title: "Stock Markets Surge Following Federal Reserve Interest Rate Decision",
    excerpt: "Major indices reach record highs as investors react positively to the Federal Reserve's latest monetary policy announcement.",
    content: `<p>Wall Street experienced its best trading day in months as major stock indices soared to record highs following the Federal Reserve's decision to maintain current interest rates while signaling potential cuts later this year.</p>
    
    <p>The Dow Jones Industrial Average gained 2.3%, the S&P 500 rose 2.1%, and the Nasdaq Composite jumped 2.8% in heavy trading volume.</p>`,
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    category: "Business",
    publishedAt: "2025-06-11T07:15:00Z",
    slug: "stock-markets-surge-fed-rate-decision",
    author: "Robert Chen",
    readTime: 4,
    tags: ["finance", "stocks", "federal reserve", "economy"],
    seoTitle: "Stock Markets Hit Record Highs After Fed Rate Decision",
    seoDescription: "Major stock indices surge to record levels as Federal Reserve maintains interest rates, signaling potential future cuts."
  },
  {
    id: "4",
    title: "Championship Victory: Local Team Makes History in National Finals",
    excerpt: "Against all odds, the underdog team secures their first national championship in a thrilling overtime victory.",
    content: `<p>In one of the most dramatic finishes in championship history, the Metropolitan Eagles secured their first-ever national title with a stunning 28-24 overtime victory over the defending champions.</p>
    
    <p>The victory caps off a remarkable season for the Eagles, who were ranked last in preseason polls but defied expectations throughout their championship run.</p>`,
    imageUrl: "https://images.unsplash.com/photo-1546717003-63d019062e8c?w=800&q=80",
    category: "Sports",
    publishedAt: "2025-06-10T22:00:00Z",
    slug: "championship-victory-eagles-national-finals",
    author: "Sarah Johnson",
    readTime: 5,
    tags: ["sports", "championship", "football", "victory"],
    seoTitle: "Eagles Win First National Championship in Dramatic Overtime Victory",
    seoDescription: "Metropolitan Eagles secure historic first national championship with thrilling 28-24 overtime win against defending champions."
  },
  {
    id: "5",
    title: "Breakthrough Medical Study Shows Promise for Alzheimer's Treatment",
    excerpt: "New research reveals significant improvements in cognitive function among patients receiving experimental treatment.",
    content: `<p>Researchers at the University Medical Center have announced promising results from a Phase III clinical trial of an experimental Alzheimer's treatment, showing significant improvements in cognitive function among participants.</p>
    
    <p>The study, which followed 1,200 patients over 18 months, demonstrated a 40% slower rate of cognitive decline compared to the control group.</p>`,
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80",
    category: "Health",
    publishedAt: "2025-06-10T14:30:00Z",
    slug: "alzheimers-treatment-breakthrough-study",
    author: "Dr. Emily Foster",
    readTime: 7,
    tags: ["health", "medical research", "alzheimers", "breakthrough"],
    seoTitle: "Major Breakthrough: New Alzheimer's Treatment Shows 40% Improvement",
    seoDescription: "Groundbreaking medical study reveals experimental Alzheimer's treatment significantly slows cognitive decline by 40%."
  },
  {
    id: "6",
    title: "Hollywood Stars Shine at Annual Awards Ceremony",
    excerpt: "The entertainment industry's biggest night celebrates outstanding achievements in film and television.",
    content: `<p>Hollywood's elite gathered last night for the annual Golden Star Awards, celebrating the year's most outstanding achievements in film and television entertainment.</p>
    
    <p>The ceremony, hosted by renowned comedian Marcus Williams, featured memorable performances and emotional acceptance speeches.</p>`,
    imageUrl: "https://images.unsplash.com/photo-1489599142023-f4a18fce1cf1?w=800&q=80",
    category: "Entertainment",
    publishedAt: "2025-06-10T11:00:00Z",
    slug: "hollywood-awards-ceremony-golden-stars",
    author: "Amanda Roberts",
    readTime: 3,
    tags: ["entertainment", "awards", "hollywood", "celebrities"],
    seoTitle: "Golden Star Awards: Hollywood's Biggest Night Celebrates Excellence",
    seoDescription: "Entertainment industry's elite gather for Golden Star Awards ceremony celebrating year's best achievements in film and TV."
  }
];

export const getArticleBySlug = (slug: string): Article | undefined => {
  return mockArticles.find(article => article.slug === slug);
};

export const getArticlesByCategory = (category: string): Article[] => {
  return mockArticles.filter(article => 
    article.category.toLowerCase() === category.toLowerCase()
  );
};

export const getFeaturedArticles = (): Article[] => {
  return mockArticles.slice(0, 3);
};

export const getTopStories = (): Article[] => {
  return mockArticles.slice(1, 5);
};

export const getRelatedArticles = (currentArticle: Article, limit: number = 3): Article[] => {
  return mockArticles
    .filter(article => 
      article.id !== currentArticle.id && 
      (article.category === currentArticle.category || 
       article.tags.some(tag => currentArticle.tags.includes(tag)))
    )
    .slice(0, limit);
};
