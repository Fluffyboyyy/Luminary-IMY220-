import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import './CommentSection.css';

const CommentSection = ({
  postId,
  comments,
  onAddComment,
  onDeleteComment,
  currentUser,
  onCommentsChange,
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddComment(commentText.trim());
      setCommentText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId) => {
    if (!currentUser) {
      alert('Please log in to like comments.');
      return;
    }
    try {
      const res = await api(
        `/api/posts/${postId}/comments/${commentId}/like`,
        { method: 'POST' }
      );
      if (onCommentsChange) {
        onCommentsChange((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? { ...c, likes: res.likes, isLiked: res.isLiked }
              : c
          )
        );
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 5);
  const hasMoreComments = comments.length > 5;

  return (
    <div className="comment-section p-4 md:p-8">
      <h3 className="comment-section-title pb-2 mb-4 md:mb-8">
        Comments ({comments.length})
      </h3>

      {currentUser && (
        <form className="mb-4 md:mb-8" onSubmit={handleSubmit}>
          <div className="comment-input-wrapper flex items-center gap-1 md:gap-2 p-1">
            <img
              src={
                currentUser.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  currentUser.name
                )}&background=6C63FF&color=fff&size=32`
              }
              alt={currentUser.name}
              className="comment-avatar w-7 h-7 md:w-8 md:h-8 ml-1"
            />
            <input
              type="text"
              className="comment-input px-2 py-1.5 md:px-3 md:py-2.5 text-sm md:text-[0.95rem]"
              placeholder="Write a comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="comment-submit-btn px-3 py-1.5 md:px-5 md:py-2 text-xs md:text-sm"
              disabled={!commentText.trim() || isSubmitting}
            >
              {isSubmitting ? '...' : 'Post'}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-2 md:gap-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-[color:var(--color-gray)]">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <>
            {displayedComments.map((comment) => {
              const commentLikes = Array.isArray(comment.likes)
                ? comment.likes.length
                : comment.likes || 0;

              return (
                <div
                  key={comment._id}
                  className="comment-item flex gap-2 p-2"
                >
                  <Link
                    to={`/profile/${comment.user?._id}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={
                        comment.user?.profileImage ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          comment.user?.name || '?'
                        )}&background=6C63FF&color=fff&size=40`
                      }
                      alt={comment.user?.name}
                      className="comment-user-avatar w-7 h-7 md:w-9 md:h-9"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <Link
                        to={`/profile/${comment.user?._id}`}
                        className="comment-username text-sm"
                      >
                        {comment.user?.name}
                      </Link>
                      <span className="text-xs text-[color:var(--color-gray)]">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="comment-text text-sm md:text-[0.95rem] leading-relaxed break-words mb-1">
                      {comment.text}
                    </p>
                    <div className="flex items-center gap-2 md:gap-4">
                      <button
                        className={`comment-action-btn like-btn flex items-center gap-0.5 text-xs px-1.5 py-0.5 ${
                          comment.isLiked ? 'liked' : ''
                        }`}
                        onClick={() => handleLike(comment._id)}
                      >
                        <span>{comment.isLiked ? '❤️' : '🤍'}</span>
                        <span>{commentLikes}</span>
                      </button>
                      {currentUser?._id === comment.user?._id && (
                        <button
                          className="comment-action-btn delete-btn text-xs px-1.5 py-0.5"
                          onClick={() => onDeleteComment(comment._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {hasMoreComments && (
              <button
                className="show-more-comments block w-full p-2 text-sm mt-2"
                onClick={() => setShowAllComments(!showAllComments)}
              >
                {showAllComments
                  ? 'Show fewer comments'
                  : `View all ${comments.length} comments`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentSection;