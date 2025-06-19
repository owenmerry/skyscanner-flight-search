export interface Author {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  social: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  specialties: string[];
  articlesCount: number;
  joinedDate: string;
  verified: boolean;
}

export interface Comment {
  id: string;
  articleId: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  replies: Comment[];
  parentId?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Bookmark {
  id: string;
  articleId: string;
  userId: string;
  createdAt: string;
  tags?: string[];
}

export interface ScheduledArticle {
  id: string;
  article: any;
  scheduledDate: string;
  status: 'scheduled' | 'published' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

// Mock authors data
export const mockAuthors: Author[] = [
  {
    id: "1",
    name: "Michael Rodriguez",
    email: "michael.rodriguez@newshub.com",
    bio: "Michael is an award-winning journalist with over 15 years of experience covering international affairs and climate policy. He has reported from over 30 countries and holds a Masters in International Relations from Columbia University.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    social: {
      twitter: "https://twitter.com/mrodriguez_news",
      linkedin: "https://linkedin.com/in/michael-rodriguez-journalist",
      website: "https://michaelrodriguez.news"
    },
    specialties: ["International Affairs", "Climate Change", "Politics"],
    articlesCount: 234,
    joinedDate: "2018-03-15",
    verified: true
  },
  {
    id: "2",
    name: "Dr. Lisa Wang",
    email: "lisa.wang@newshub.com",
    bio: "Dr. Wang is a technology journalist and former software engineer with expertise in AI, healthcare technology, and digital innovation. She holds a PhD in Computer Science from MIT.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5a4?w=400&q=80",
    social: {
      twitter: "https://twitter.com/drlisaw_tech",
      linkedin: "https://linkedin.com/in/lisa-wang-tech"
    },
    specialties: ["Technology", "AI", "Healthcare", "Innovation"],
    articlesCount: 189,
    joinedDate: "2019-07-22",
    verified: true
  },
  {
    id: "3",
    name: "Robert Chen",
    email: "robert.chen@newshub.com",
    bio: "Robert is a financial journalist specializing in markets, economics, and business strategy. He previously worked as a financial analyst on Wall Street before transitioning to journalism.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    social: {
      twitter: "https://twitter.com/robertchen_biz",
      linkedin: "https://linkedin.com/in/robert-chen-finance"
    },
    specialties: ["Finance", "Business", "Economics", "Markets"],
    articlesCount: 156,
    joinedDate: "2020-01-10",
    verified: true
  },
  {
    id: "4",
    name: "Sarah Johnson",
    email: "sarah.johnson@newshub.com",
    bio: "Sarah covers sports with a focus on professional athletics, sports business, and the intersection of sports and society. She's a former collegiate athlete with deep connections in the sports world.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    social: {
      twitter: "https://twitter.com/sarahj_sports",
      linkedin: "https://linkedin.com/in/sarah-johnson-sports"
    },
    specialties: ["Sports", "Athletics", "Sports Business"],
    articlesCount: 98,
    joinedDate: "2021-09-05",
    verified: true
  },
  {
    id: "5",
    name: "Dr. Emily Foster",
    email: "emily.foster@newshub.com",
    bio: "Dr. Foster is a medical journalist and practicing physician who translates complex medical research into accessible health news for the public.",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    social: {
      linkedin: "https://linkedin.com/in/dr-emily-foster-md",
      website: "https://drfoster.health"
    },
    specialties: ["Health", "Medicine", "Public Health", "Research"],
    articlesCount: 76,
    joinedDate: "2022-02-14",
    verified: true
  },
  {
    id: "6",
    name: "Amanda Roberts",
    email: "amanda.roberts@newshub.com",
    bio: "Amanda covers entertainment, culture, and the arts with insider access to Hollywood and the entertainment industry.",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
    social: {
      twitter: "https://twitter.com/amanda_ent",
      linkedin: "https://linkedin.com/in/amanda-roberts-entertainment"
    },
    specialties: ["Entertainment", "Culture", "Arts", "Media"],
    articlesCount: 67,
    joinedDate: "2022-06-30",
    verified: false
  }
];

// Helper functions
export function getAuthorByName(name: string): Author | undefined {
  return mockAuthors.find(author => author.name === name);
}

export function getAuthorById(id: string): Author | undefined {
  return mockAuthors.find(author => author.id === id);
}

export function getAuthorArticles(authorName: string, articles: any[]): any[] {
  return articles.filter(article => article.author === authorName);
}

export function getAllAuthors(): Author[] {
  return mockAuthors;
}

// Mock comments data
export const mockComments: Comment[] = [
  {
    id: "1",
    articleId: "1",
    author: {
      name: "John Smith",
      email: "john@example.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
    },
    content: "This is a fantastic article! Really appreciate the in-depth analysis of the climate agreement.",
    createdAt: "2025-06-11T12:00:00Z",
    likes: 15,
    replies: [
      {
        id: "2",
        articleId: "1",
        parentId: "1",
        author: {
          name: "Jane Doe",
          email: "jane@example.com"
        },
        content: "I agree! The section on international cooperation was particularly insightful.",
        createdAt: "2025-06-11T12:30:00Z",
        likes: 8,
        replies: [],
        status: 'approved'
      }
    ],
    status: 'approved'
  },
  {
    id: "3",
    articleId: "1",
    author: {
      name: "Climate Researcher",
      email: "researcher@university.edu",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80"
    },
    content: "As someone working in climate science, I can confirm that this agreement represents a significant step forward. The binding commitments are what we've been waiting for.",
    createdAt: "2025-06-11T14:15:00Z",
    likes: 23,
    replies: [],
    status: 'approved'
  }
];

export function getCommentsByArticleId(articleId: string): Comment[] {
  return mockComments.filter(comment => comment.articleId === articleId && !comment.parentId);
}

export function addComment(comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'replies' | 'status'>): Comment {
  const newComment: Comment = {
    ...comment,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    likes: 0,
    replies: [],
    status: 'pending'
  };
  
  mockComments.push(newComment);
  return newComment;
}

// Mock bookmarks data
export const mockBookmarks: Bookmark[] = [
  {
    id: "1",
    articleId: "1",
    userId: "user123",
    createdAt: "2025-06-11T10:00:00Z",
    tags: ["climate", "important"]
  },
  {
    id: "2", 
    articleId: "2",
    userId: "user123",
    createdAt: "2025-06-11T09:00:00Z",
    tags: ["tech", "ai"]
  }
];

export function getUserBookmarks(userId: string): Bookmark[] {
  return mockBookmarks.filter(bookmark => bookmark.userId === userId);
}

export function isArticleBookmarked(articleId: string, userId: string): boolean {
  return mockBookmarks.some(bookmark => 
    bookmark.articleId === articleId && bookmark.userId === userId
  );
}

export function toggleBookmark(articleId: string, userId: string): boolean {
  const existingIndex = mockBookmarks.findIndex(bookmark => 
    bookmark.articleId === articleId && bookmark.userId === userId
  );
  
  if (existingIndex >= 0) {
    mockBookmarks.splice(existingIndex, 1);
    return false; // Removed bookmark
  } else {
    mockBookmarks.push({
      id: Math.random().toString(36).substr(2, 9),
      articleId,
      userId,
      createdAt: new Date().toISOString()
    });
    return true; // Added bookmark
  }
}
