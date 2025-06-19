import { useEffect, useState } from "react";
import type { Article } from "./newsData";

interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  recommendations: SEORecommendation[];
  metrics: SEOMetrics;
}

interface SEOIssue {
  type: "error" | "warning" | "info";
  category: "title" | "description" | "content" | "images" | "structure" | "performance";
  message: string;
  impact: "high" | "medium" | "low";
}

interface SEORecommendation {
  category: string;
  message: string;
  priority: "high" | "medium" | "low";
}

interface SEOMetrics {
  titleLength: number;
  descriptionLength: number;
  headingStructure: string[];
  imageCount: number;
  imagesWithAlt: number;
  internalLinks: number;
  externalLinks: number;
  wordCount: number;
  readabilityScore: number;
}

export function SEOAnalyzer({ article }: { article?: Article }) {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const analyzePageSEO = () => {
      const issues: SEOIssue[] = [];
      const recommendations: SEORecommendation[] = [];
      
      // Get page elements
      const title = document.title;
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const images = Array.from(document.querySelectorAll('img'));
      const links = Array.from(document.querySelectorAll('a[href]'));
      const content = document.querySelector('main')?.textContent || '';
      
      // Analyze title
      const titleLength = title.length;
      if (titleLength === 0) {
        issues.push({
          type: "error",
          category: "title",
          message: "Missing page title",
          impact: "high"
        });
      } else if (titleLength < 30) {
        issues.push({
          type: "warning",
          category: "title",
          message: "Title is too short (less than 30 characters)",
          impact: "medium"
        });
      } else if (titleLength > 60) {
        issues.push({
          type: "warning",
          category: "title",
          message: "Title is too long (more than 60 characters)",
          impact: "medium"
        });
      }

      // Analyze meta description
      const descriptionLength = metaDescription.length;
      if (descriptionLength === 0) {
        issues.push({
          type: "error",
          category: "description",
          message: "Missing meta description",
          impact: "high"
        });
      } else if (descriptionLength < 120) {
        issues.push({
          type: "warning",
          category: "description",
          message: "Meta description is too short (less than 120 characters)",
          impact: "medium"
        });
      } else if (descriptionLength > 160) {
        issues.push({
          type: "warning",
          category: "description",
          message: "Meta description is too long (more than 160 characters)",
          impact: "medium"
        });
      }

      // Analyze heading structure
      const h1Count = headings.filter(h => h.tagName === 'H1').length;
      if (h1Count === 0) {
        issues.push({
          type: "error",
          category: "structure",
          message: "Missing H1 heading",
          impact: "high"
        });
      } else if (h1Count > 1) {
        issues.push({
          type: "warning",
          category: "structure",
          message: "Multiple H1 headings found",
          impact: "medium"
        });
      }

      // Analyze images
      const imagesWithAlt = images.filter(img => img.alt && img.alt.trim()).length;
      if (images.length > 0 && imagesWithAlt < images.length) {
        issues.push({
          type: "warning",
          category: "images",
          message: `${images.length - imagesWithAlt} images missing alt text`,
          impact: "medium"
        });
      }

      // Analyze links
      const internalLinks = links.filter(link => {
        const href = link.getAttribute('href') || '';
        return href.startsWith('/') || href.includes(window.location.hostname);
      }).length;
      
      const externalLinks = links.filter(link => {
        const href = link.getAttribute('href') || '';
        return href.startsWith('http') && !href.includes(window.location.hostname);
      }).length;

      // Analyze content
      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
      if (wordCount < 300) {
        issues.push({
          type: "warning",
          category: "content",
          message: "Content is too short (less than 300 words)",
          impact: "medium"
        });
      }

      // Generate recommendations
      if (article) {
        if (!article.seoTitle) {
          recommendations.push({
            category: "SEO",
            message: "Add a custom SEO title to optimize search appearance",
            priority: "medium"
          });
        }
        
        if (!article.seoDescription) {
          recommendations.push({
            category: "SEO", 
            message: "Add a custom SEO description for better search snippets",
            priority: "medium"
          });
        }
        
        if (article.tags.length < 3) {
          recommendations.push({
            category: "Content",
            message: "Add more tags to improve content discoverability",
            priority: "low"
          });
        }
      }

      if (internalLinks < 3) {
        recommendations.push({
          category: "SEO",
          message: "Add more internal links to improve site navigation and SEO",
          priority: "medium"
        });
      }

      // Calculate readability score (simplified Flesch Reading Ease)
      const sentences = content.split(/[.!?]+/).filter(s => s.trim()).length;
      const syllables = content.split(/\s+/).reduce((count, word) => {
        return count + countSyllables(word);
      }, 0);
      
      const readabilityScore = sentences > 0 && wordCount > 0 
        ? 206.835 - (1.015 * (wordCount / sentences)) - (84.6 * (syllables / wordCount))
        : 0;

      const metrics: SEOMetrics = {
        titleLength,
        descriptionLength,
        headingStructure: headings.map(h => h.tagName),
        imageCount: images.length,
        imagesWithAlt,
        internalLinks,
        externalLinks,
        wordCount,
        readabilityScore: Math.max(0, readabilityScore)
      };

      // Calculate overall score
      let score = 100;
      issues.forEach(issue => {
        if (issue.impact === "high") score -= 20;
        else if (issue.impact === "medium") score -= 10;
        else score -= 5;
      });
      score = Math.max(0, score);

      setAnalysis({
        score,
        issues,
        recommendations,
        metrics
      });
    };

    // Run analysis after DOM is ready
    if (document.readyState === 'complete') {
      analyzePageSEO();
    } else {
      window.addEventListener('load', analyzePageSEO);
      return () => window.removeEventListener('load', analyzePageSEO);
    }
  }, [article]);

  return analysis;
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

export function SEOScoreIndicator({ score }: { score: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Poor";
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
      <span className="mr-1">{score}/100</span>
      <span>{getScoreLabel(score)}</span>
    </div>
  );
}

export function SEOIssuesList({ issues }: { issues: SEOIssue[] }) {
  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return (
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  if (issues.length === 0) {
    return (
      <div className="text-center py-4 text-green-600">
        <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <p className="text-sm font-medium">No SEO issues found!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {issues.map((issue, index) => (
        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          {getIssueIcon(issue.type)}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{issue.message}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500 capitalize">{issue.category}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                issue.impact === "high" ? "bg-red-100 text-red-700" :
                issue.impact === "medium" ? "bg-yellow-100 text-yellow-700" :
                "bg-blue-100 text-blue-700"
              }`}>
                {issue.impact} impact
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Hook for using SEO analysis in components
export function useSEOAnalysis(article?: Article) {
  return SEOAnalyzer({ article });
}
