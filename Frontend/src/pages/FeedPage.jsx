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
    <div className="max-w-[800px] mx-auto p-2 md:p-8">
      <div className="text-center mb-4 md:mb-6">
        <h1 className="text-2xl md:text-4xl mb-1">Activity Feed</h1>
        <p className="feed-subtitle text-sm md:text-lg">
          {feedType === 'local'
            ? 'See what your friends are sharing'
            : 'Discover posts from the community'}
        </p>
      </div>

      <div className="relative max-w-full md:max-w-[500px] mx-auto mb-4 md:mb-6">
        <input
          type="text"
          className="search-input w-full py-2 md:py-3 pl-10 md:pl-12 pr-4 text-sm md:text-base"
          placeholder="Search posts, users, hashtags"
          value={searchTerm}
          onChange={handleSearch}
        />
        <span className="search-icon left-4 text-base md:text-lg">🔍</span>
      </div>

      <div className="flex justify-center gap-1 md:gap-2 mb-4 md:mb-8">
        <button
          className={`feed-tab px-3 py-1.5 md:px-6 md:py-2.5 text-xs md:text-sm ${
            feedType === 'local' ? 'active' : ''
          }`}
          onClick={() => setFeedType('local')}
        >
          Friends
        </button>
        <button
          className={`feed-tab px-3 py-1.5 md:px-6 md:py-2.5 text-xs md:text-sm ${
            feedType === 'global' ? 'active' : ''
          }`}
          onClick={() => setFeedType('global')}
        >
          Global
        </button>
      </div>

      <div className="flex flex-col gap-4 md:gap-8">
        {mockPosts.map((post) => (
          <article key={post.id} className="post-card">
            <div className="flex items-center justify-between p-3 md:p-5">
              <Link
                to={`/profile/${post.userId}`}
                className="post-user flex items-center gap-2 md:gap-3 flex-1"
              >
                <img
                  src={post.avatar}
                  alt={post.user}
                  className="post-avatar w-8 h-8 md:w-10 md:h-10"
                />
                <div className="flex flex-col">
                  <span className="post-username text-sm md:text-[0.95rem]">
                    {post.user}
                  </span>
                  <span className="post-userhandle text-xs md:text-[0.8rem]">
                    @{post.username}
                  </span>
                </div>
              </Link>
              <span className="post-time text-xs md:text-[0.8rem]">
                {post.createdAt}
              </span>
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

            <div className="p-3 md:p-5">
              <Link to={`/post/${post.id}`} className="post-description-link">
                <p className="post-description text-sm md:text-[0.95rem] leading-relaxed mb-2">
                  {post.description}
                </p>
              </Link>
              <div className="flex flex-wrap gap-2 mb-3">
                {post.hashtags.map((tag, index) => (
                  <span key={index} className="hashtag text-sm md:text-[0.9rem]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="post-stats flex gap-4 md:gap-6 pt-3">
                <span className="post-stat text-xs md:text-[0.9rem]">
                  ❤️ {post.likes}
                </span>
                <span className="post-stat text-xs md:text-[0.9rem]">
                  💬 {post.comments}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default FeedPage;