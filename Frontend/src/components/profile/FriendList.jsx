import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FriendList.css';

const FriendList = ({ friends, isOwnProfile }) => {
  const [showAll, setShowAll] = useState(false);

  if (!friends || friends.length === 0) {
    return (
      <div className="friend-list">
        <h4>Friends</h4>
        <p className="friend-list-empty">No friends yet</p>
      </div>
    );
  }

  const displayedFriends = showAll ? friends : friends.slice(0, 6);
  const hasMore = friends.length > 6;

  return (
    <div className="friend-list">
      <div className="friend-list-header">
        <h4>Friends ({friends.length})</h4>
        {hasMore && (
          <button 
            className="friend-list-toggle"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : 'Show All'}
          </button>
        )}
      </div>
      
      <div className="friend-list-grid">
        {displayedFriends.map(friend => (
          <Link 
            to={`/profile/${friend.id}`} 
            key={friend.id}
            className="friend-item"
          >
            <img 
              src={friend.avatar || `https://ui-avatars.com/api/?name=${friend.name}&background=6C63FF&color=fff&size=50`}
              alt={friend.name}
              className="friend-avatar"
              loading="lazy"
            />
            <span className="friend-name">{friend.name}</span>
            <span className="friend-username">@{friend.username}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FriendList;