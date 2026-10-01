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

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="post-details">
      <div className="post-details-header flex items-center justify-between p-2 md:p-4">
        <Link
          to={`/profile/${post.user.id}`}
          className="post-details-user flex items-center gap-2"
        >
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="post-details-avatar w-9 h-9 md:w-12 md:h-12"
          />
          <div className="flex flex-col">
            <div className="post-details-name flex items-center gap-1 text-sm md:text-base">
              {post.user.name}
            </div>
            <span className="post-details-username text-xs md:text-sm">
              @{post.user.username}
            </span>
          </div>
        </Link>

        <div className="relative">
          <button
            className="post-details-action-btn text-2xl px-2 py-1"
            onClick={() => setShowActions(!showActions)}
          >
            ⋮
          </button>

          {showActions && (
            <div className="action-dropdown min-w-[180px] p-2">
              {isOwner ? (
                <>
                  <button
                    onClick={onEdit}
                    className="dropdown-item flex items-center gap-2 w-full px-3 py-2 text-sm"
                  >
                    Edit Post
                  </button>
                  <button
                    onClick={onDelete}
                    className="dropdown-item danger flex items-center gap-2 w-full px-3 py-2 text-sm"
                  >
                    Delete Post
                  </button>
                </>
              ) : (
                <button className="dropdown-item danger flex items-center gap-2 w-full px-3 py-2 text-sm">
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

      <div className="p-2 md:p-8">
        <p className="post-details-description text-sm md:text-[1.05rem] leading-relaxed md:leading-[1.8] mb-4">
          {post.description}
        </p>

        {post.hashtags && post.hashtags.length > 0 && (
          <div className="post-details-hashtags gap-2 mb-4">
            {post.hashtags.map((tag, index) => (
              <span key={index} className="hashtag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.location && (
          <div className="post-details-metadata flex flex-wrap gap-4 py-2 mb-4">
            <span className="metadata-item text-sm">{post.location}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-4 border-b border-[color:var(--color-gray-light)] mb-2">
          <div className="flex items-center gap-4 md:gap-8">
            <button
              className={`like-btn flex items-center gap-1 text-base px-2 py-1 ${
                isLiked ? 'liked' : ''
              }`}
              onClick={onLike}
            >
              <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span>
              <span>{likesCount}</span>
            </button>
            <span className="comment-stat flex items-center gap-1">
              <span>💬</span>
              <span>{post.commentCount || 0}</span>
            </span>
          </div>
          <span className="post-time text-xs md:text-sm">
            {formatDate(post.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;