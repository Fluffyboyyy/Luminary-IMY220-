import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import './FriendList.css';

const FriendList = ({ friends, isOwnProfile }) => {
  const [showAll, setShowAll] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!isOwnProfile) return;
    let cancelled = false;
    api('/api/friends/requests')
      .then((data) => {
        if (!cancelled) setPendingCount(data.requests?.length || 0);
      })
      .catch(() => {
        if (!cancelled) setPendingCount(0);
      });
    return () => { cancelled = true; };
  }, [isOwnProfile]);

  // Empty state — no friends
  if (!friends || friends.length === 0) {
    return (
      <div className="friend-list p-2 md:p-8 mt-8">
        <div className="friend-list-header flex items-center justify-between pb-2 mb-4">
          <h4 className="text-base md:text-[1.3rem]">Friends</h4>
          {isOwnProfile && pendingCount > 0 && (
            <Link to="/friends/requests" className="friend-list-toggle text-xs md:text-sm px-2 py-1 md:px-3 md:py-1">
              Pending ({pendingCount})
            </Link>
          )}
        </div>
        <p className="friend-list-empty text-sm py-4">No friends yet</p>
      </div>
    );
  }

  const displayedFriends = showAll ? friends : friends.slice(0, 6);
  const hasMore = friends.length > 6;

  return (
    <div className="friend-list p-2 md:p-8 mt-8">
      <div className="friend-list-header flex items-center justify-between pb-2 mb-4 flex-wrap gap-2">
        <h4 className="text-base md:text-[1.3rem]">
          Friends ({friends.length})
        </h4>

        <div className="flex items-center gap-2">
          {isOwnProfile && (
            <Link
              to="/friends/requests"
              className={`friend-list-toggle text-xs md:text-sm px-2 py-1 md:px-3 md:py-1 ${
                pendingCount > 0 ? 'friend-list-toggle-alert' : ''
              }`}
            >
              {pendingCount > 0
                ? `Pending Requests (${pendingCount})`
                : 'Pending Requests'}
            </Link>
          )}

          {hasMore && (
            <button
              className="friend-list-toggle text-xs md:text-sm px-2 py-1 md:px-3 md:py-1"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : 'Show All'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(55px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-1 md:gap-4">
        {displayedFriends.map((friend) => (
          <Link
            to={`/profile/${friend._id}`}
            key={friend._id}
            className="friend-item flex flex-col items-center p-1 md:p-2"
          >
            <img
              src={
                friend.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  friend.name
                )}&background=6C63FF&color=fff&size=50`
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