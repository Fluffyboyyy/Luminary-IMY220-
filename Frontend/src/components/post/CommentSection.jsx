import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CommentSection.css';

const CommentSection = ({ 
  comments, 
  onAddComment, 
  onDeleteComment,
  onLikeComment,  
  currentUser
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      onAddComment(commentText.trim());
      setCommentText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 5);
  const hasMoreComments = comments.length > 5;

  return (
    <div className="comment-section">
      <h3 className="comment-section-title">
        Comments ({comments.length})
      </h3>

      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="comment-input-wrapper">
          <img 
            src={currentUser?.avatar || `https://ui-avatars.com/api/?name=You&background=6C63FF&color=fff&size=32`}
            alt="Your avatar"
            className="comment-avatar"
          />
          <input
            type="text"
            className="comment-input"
            placeholder="Write a comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            className="comment-submit-btn"
            disabled={!commentText.trim() || isSubmitting}
          >
            {isSubmitting ? '...' : 'Post'}
          </button>
        </div>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <>
            {displayedComments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <Link to={`/profile/${comment.user.id}`} className="comment-user">
                  <img 
                    src={comment.user.avatar} 
                    alt={comment.user.name}
                    className="comment-user-avatar"
                  />
                </Link>
                <div className="comment-content">
                  <div className="comment-header">
                    <Link to={`/profile/${comment.user.id}`} className="comment-username">
                      {comment.user.name}
                    </Link>
                    <span className="comment-time">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-actions">
                    <button 
                      className={`comment-action-btn like-btn ${comment.isLiked ? 'liked' : ''}`}
                      onClick={() => onLikeComment(comment.id)}
                    >
                      <span>{comment.isLiked ? '❤️' : '🤍'}</span>
                      <span>{comment.likes || 0}</span>
                    </button>
                    {(currentUser?.id === comment.user.id) && (
                      <button 
                        className="comment-action-btn delete-btn"
                        onClick={() => onDeleteComment(comment.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {hasMoreComments && (
              <button 
                className="show-more-comments"
                onClick={() => setShowAllComments(!showAllComments)}
              >
                {showAllComments ? 'Show fewer comments' : `View all ${comments.length} comments`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentSection;