import React from 'react';
import { Link } from 'react-router-dom';
import './PostList.css';

const PostList = ({ posts, isOwnProfile }) => {
  if (posts.length === 0) {
    return (
      <div className="post-list-empty">
        <h3>No posts yet</h3>
        <p>
          {isOwnProfile 
            ? 'Share your first photo with the world!' 
            : 'This user hasn\'t posted anything yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="post-list">
      <div className="post-list-header">
        <h3 className="post-list-title">Posts ({posts.length})</h3>
      </div>

      <div className="post-list-items">
        {posts.map((post) => (
          <Link to={`/post/${post.id}`} key={post.id} className="post-item">
            <div className="post-item-image-wrapper">
              <img 
                src={post.image} 
                alt={post.description}
                className="post-item-image"
                loading="lazy"
              />
            </div>
            <div className="post-item-info">
              <p className="post-item-description">{post.description}</p>
              <div className="post-item-stats">
                <span className="post-stat">❤️ {post.likes}</span>
                <span className="post-stat">💬 {post.comments}</span>
              </div>
              <span className="post-item-date">
                {post.createdAt.toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PostList;