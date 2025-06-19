import { Link } from "@remix-run/react";
import type { Author } from "./extendedData";

interface AuthorProfileProps {
  author: Author;
  articleCount?: number;
  showBio?: boolean;
  size?: "small" | "medium" | "large";
}

export function AuthorProfile({ 
  author, 
  articleCount, 
  showBio = true, 
  size = "medium" 
}: AuthorProfileProps) {
  const avatarSize = {
    small: "w-12 h-12",
    medium: "w-16 h-16", 
    large: "w-24 h-24"
  }[size];

  const nameSize = {
    small: "text-base",
    medium: "text-lg",
    large: "text-2xl"
  }[size];

  return (
    <div className="flex items-start space-x-4">
      <Link to={`/g/news/author/${author.name.toLowerCase().replace(/\s+/g, '-')}`}>
        <img
          src={author.avatar}
          alt={author.name}
          className={`${avatarSize} rounded-full object-cover hover:opacity-75 transition-opacity`}
        />
      </Link>
      
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <Link 
            to={`/g/news/author/${author.name.toLowerCase().replace(/\s+/g, '-')}`}
            className={`${nameSize} font-semibold text-gray-900 hover:text-blue-600 transition-colors`}
          >
            {author.name}
          </Link>
          {author.verified && (
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        
        <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
          <span>{articleCount || author.articlesCount} articles</span>
          <span>•</span>
          <span>Joined {new Date(author.joinedDate).getFullYear()}</span>
        </div>
        
        {author.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {author.specialties.slice(0, 3).map((specialty) => (
              <span
                key={specialty}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {specialty}
              </span>
            ))}
          </div>
        )}
        
        {showBio && size === "large" && (
          <p className="text-gray-700 leading-relaxed mb-4">{author.bio}</p>
        )}
        
        {/* Social Links */}
        {Object.keys(author.social).length > 0 && (
          <div className="flex items-center space-x-3">
            {author.social.twitter && (
              <a
                href={author.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
            )}
            {author.social.linkedin && (
              <a
                href={author.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
            {author.social.website && (
              <a
                href={author.social.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function AuthorCard({ author }: { author: Author }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <AuthorProfile author={author} showBio={false} size="medium" />
      
      <p className="text-gray-600 text-sm mt-3 line-clamp-3">
        {author.bio}
      </p>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          to={`/g/news/author/${author.name.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View all articles →
        </Link>
      </div>
    </div>
  );
}

export function AuthorList({ authors }: { authors: Author[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {authors.map((author) => (
        <AuthorCard key={author.id} author={author} />
      ))}
    </div>
  );
}
