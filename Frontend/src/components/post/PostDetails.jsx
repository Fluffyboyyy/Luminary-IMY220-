import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PostDetails.css';

const PostDetails = ({ 
  post, 
  isOwner, 
  isLiked, 
  likesCount, 
  onLike, 
  onEdit,
  onDelete,
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="post-details">
      <div className="post-details-header">
        <Link to={`/profile/${post.user.id}`} className="post-details-user">
          <img 
            src={post.user.avatar} 
            alt={post.user.name}
            className="post-details-avatar"
          />
          <div className="post-details-user-info">
            <div className="post-details-name">
              {post.user.name}
            </div>
            <span className="post-details-username">@{post.user.username}</span>
          </div>
        </Link>
        
        <div className="post-details-actions">
          <button 
            className="post-details-action-btn"
            onClick={() => setShowActions(!showActions)}
          >
            ⋮
          </button>
          
          {showActions && (
            <div className="action-dropdown">
              {isOwner ? (
                <>
                  <button onClick={onEdit} className="dropdown-item">
                    Edit Post
                  </button>
                  <button onClick={onDelete} className="dropdown-item danger">
                    Delete Post
                  </button>
                </>
              ) : (
                <button className="dropdown-item danger">
                  Report Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="post-details-image-wrapper">
        <img 
          src={post.image} 
          alt={post.description}
          className="post-details-image"
        />
      </div>

      <div className="post-details-content">
        <p className="post-details-description">
          {post.description}
        </p>

        {post.hashtags && post.hashtags.length > 0 && (
          <div className="post-details-hashtags">
            {post.hashtags.map((tag, index) => (
              <span key={index} className="hashtag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.location && (
          <div className="post-details-metadata">
            <span className="metadata-item">
              {post.location}
            </span>
          </div>
        )}

        <div className="post-details-engagement">
          <div className="engagement-stats">
            <button 
              className={`like-btn ${isLiked ? 'liked' : ''}`}
              onClick={onLike}
            >
              <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span>
              <span className="like-count">{likesCount}</span>
            </button>
            <span className="comment-stat">
              <span className="comment-icon">💬</span>
              <span>{post.commentCount || 0}</span>
            </span>
          </div>
          <span className="post-time">{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;