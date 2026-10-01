import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FriendList.css';

const FriendList = ({ friends, isOwnProfile }) => {
  const [showAll, setShowAll] = useState(false);

  if (!friends || friends.length === 0) {
    return (
      <div className="friend-list p-2 md:p-8 mt-8">
        <h4 className="text-base md:text-[1.3rem] mb-2">Friends</h4>
        <p className="friend-list-empty text-sm py-4">No friends yet</p>
      </div>
    );
  }

  const displayedFriends = showAll ? friends : friends.slice(0, 6);
  const hasMore = friends.length > 6;

  return (
    <div className="friend-list p-2 md:p-8 mt-8">
      <div className="friend-list-header flex items-center justify-between pb-2 mb-4">
        <h4 className="text-base md:text-[1.3rem]">
          Friends ({friends.length})
        </h4>
        {hasMore && (
          <button
            className="friend-list-toggle text-xs md:text-sm px-2 py-1 md:px-3 md:py-1"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : 'Show All'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(55px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-1 md:gap-4">
        {displayedFriends.map((friend) => (
          <Link
            to={`/profile/${friend.id}`}
            key={friend.id}
            className="friend-item flex flex-col items-center p-1 md:p-2"
          >
            <img
              src={
                friend.avatar ||
                `https://ui-avatars.com/api/?name=${friend.name}&background=6C63FF&color=fff&size=50`
              }
              alt={friend.name}
              className="friend-avatar w-[45px] h-[45px] md:w-[60px] md:h-[60px] mb-1"
              loading="lazy"
            />
            <span className="friend-name text-[0.65rem] md:text-[0.8rem]">
              {friend.name}
            </span>
            <span className="friend-username text-[0.55rem] md:text-[0.7rem]">
              @{friend.username}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FriendList;