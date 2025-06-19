import { useState } from "react";
import type { Comment } from "./extendedData";
import { addComment } from "./extendedData";

interface CommentsProps {
  articleId: string;
  comments: Comment[];
  allowComments?: boolean;
}

interface CommentFormProps {
  articleId: string;
  parentId?: string;
  onCommentAdded: (comment: Comment) => void;
  onCancel?: () => void;
  placeholder?: string;
}

function CommentForm({ 
  articleId, 
  parentId, 
  onCommentAdded, 
  onCancel,
  placeholder = "Share your thoughts..."
}: CommentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !content.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newComment = addComment({
        articleId,
        parentId,
        author: {
          name: name.trim(),
          email: email.trim()
        },
        content: content.trim()
      });

      onCommentAdded(newComment);
      
      // Reset form
      setName("");
      setEmail("");
      setContent("");
      
      if (onCancel) onCancel();
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Comment *
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder={placeholder}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Your email will not be published. Required fields are marked *
        </p>
        <div className="flex space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>
    </form>
  );
}

function CommentItem({ 
  comment, 
  onReply, 
  onCommentAdded 
}: { 
  comment: Comment;
  onReply: (commentId: string) => void;
  onCommentAdded: (comment: Comment) => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [likes, setLikes] = useState(comment.likes);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const handleReplySubmitted = (newComment: Comment) => {
    onCommentAdded(newComment);
    setShowReplyForm(false);
  };

  const timeAgo = new Date(comment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          <img
            src={comment.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.name)}&background=3B82F6&color=fff`}
            alt={comment.author.name}
            className="w-10 h-10 rounded-full"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900">
                {comment.author.name}
              </h4>
              <time className="text-xs text-gray-500" dateTime={comment.createdAt}>
                {timeAgo}
              </time>
            </div>
            
            <p className="text-gray-700 whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-2">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 text-xs transition-colors ${
                hasLiked ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <svg className="w-4 h-4" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likes}</span>
            </button>
            
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
            >
              Reply
            </button>
          </div>
          
          {showReplyForm && (
            <div className="mt-4">
              <CommentForm
                articleId={comment.articleId}
                parentId={comment.id}
                onCommentAdded={handleReplySubmitted}
                onCancel={() => setShowReplyForm(false)}
                placeholder={`Reply to ${comment.author.name}...`}
              />
            </div>
          )}
          
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-4 space-y-4 border-l-2 border-gray-200 pl-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onCommentAdded={onCommentAdded}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Comments({ articleId, comments: initialComments, allowComments = true }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleCommentAdded = (newComment: Comment) => {
    if (newComment.parentId) {
      // This is a reply - add it to the parent comment
      setComments(prev => prev.map(comment => {
        if (comment.id === newComment.parentId) {
          return {
            ...comment,
            replies: [...comment.replies, newComment]
          };
        }
        return comment;
      }));
    } else {
      // This is a top-level comment
      setComments(prev => [newComment, ...prev]);
    }
  };

  const handleReply = (commentId: string) => {
    // This could trigger focusing on a reply form
    console.log("Reply to comment:", commentId);
  };

  const approvedComments = comments.filter(comment => comment.status === 'approved');

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Comments ({approvedComments.length})
        </h3>
        {allowComments && (
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Comment
          </button>
        )}
      </div>
      
      {showCommentForm && allowComments && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Leave a Comment</h4>
          <CommentForm
            articleId={articleId}
            onCommentAdded={handleCommentAdded}
            onCancel={() => setShowCommentForm(false)}
          />
        </div>
      )}
      
      {approvedComments.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h4>
          <p className="text-gray-600">
            {allowComments 
              ? "Be the first to share your thoughts on this article!"
              : "Comments are disabled for this article."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {approvedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onCommentAdded={handleCommentAdded}
            />
          ))}
        </div>
      )}
      
      {!allowComments && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Comments are disabled for this article.
        </div>
      )}
    </section>
  );
}
