import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import './FeedPage.css';

const FeedPage = () => {
  const [feedType, setFeedType] = useState('local');
  const [searchTerm, setSearchTerm] = useState('');

  const mockPosts = [
    {
      id: 1,
      user: 'Alice Johnson',
      username: 'alicej',
      userId: 1, 
      avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=6C63FF&color=fff&size=40',
      image: 'https://picsum.photos/seed/1/600/350',
      description: 'Beautiful sunset at the beach! #sunset #beach',
      hashtags: ['#sunset', '#beach'],
      createdAt: '2 hours ago',
      likes: 42,
      comments: 5
    },
    {
      id: 2,
      user: 'Bob Smith',
      username: 'bobs',
      userId: 2,
      avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=FF6584&color=fff&size=40',
      image: 'https://picsum.photos/seed/2/600/350',
      description: 'New art project in progress #art #creative',
      hashtags: ['#art', '#creative'],
      createdAt: '5 hours ago',
      likes: 28,
      comments: 3
    },
    {
      id: 3,
      user: 'Carol Davis',
      username: 'carold',
      userId: 3,
      avatar: 'https://ui-avatars.com/api/?name=Carol+Davis&background=00D4AA&color=fff&size=40',
      image: 'https://picsum.photos/seed/3/600/350',
      description: 'Coffee and coding #coding #developer',
      hashtags: ['#coding', '#developer'],
      createdAt: '1 day ago',
      likes: 56,
      comments: 8
    }
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="feed-page">
      <div className="feed-header">
        <h1>Activity Feed</h1>
        <p className="feed-subtitle">
          {feedType === 'local' 
            ? 'See what your friends are sharing' 
            : 'Discover posts from the community'}
        </p>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search posts, users, hashtags"
          value={searchTerm}
          onChange={handleSearch}
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="feed-tabs">
        <button 
          className={`feed-tab ${feedType === 'local' ? 'active' : ''}`}
          onClick={() => setFeedType('local')}
        >
          Friends
        </button>
        <button 
          className={`feed-tab ${feedType === 'global' ? 'active' : ''}`}
          onClick={() => setFeedType('global')}
        >
          Global
        </button>
      </div>

      <div className="posts-grid">
        {mockPosts.map((post) => (
          <article key={post.id} className="post-card">
            <div className="post-header">
              <Link to={`/profile/${post.userId}`} className="post-user">
                <img 
                  src={post.avatar} 
                  alt={post.user}
                  className="post-avatar"
                />
                <div className="post-user-info">
                  <span className="post-username">{post.user}</span>
                  <span className="post-userhandle">@{post.username}</span>
                </div>
              </Link>
              <span className="post-time">{post.createdAt}</span>
            </div>

            <Link to={`/post/${post.id}`} className="post-image-link">
              <div className="post-image-wrapper">
                <img 
                  src={post.image} 
                  alt={post.description}
                  className="post-image"
                />
              </div>
            </Link>

            <div className="post-content">
              <Link to={`/post/${post.id}`} className="post-description-link">
                <p className="post-description">{post.description}</p>
              </Link>
              <div className="post-hashtags">
                {post.hashtags.map((tag, index) => (
                  <span key={index} className="hashtag">{tag}</span>
                ))}
              </div>
              <div className="post-stats">
                <span className="post-stat">❤️ {post.likes}</span>
                <span className="post-stat">💬 {post.comments}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default FeedPage;