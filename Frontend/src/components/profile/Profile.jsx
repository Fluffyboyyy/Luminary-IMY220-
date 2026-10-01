import React from 'react';
import './Profile.css';

const Profile = ({ profile, isOwnProfile }) => {
  const defaultAvatar = `https://ui-avatars.com/api/?name=${profile.name}&background=6C63FF&color=fff&size=120`;

  return (
    <div className="profile flex flex-col items-center p-4 md:p-8">
      <div className="mb-4">
        <img
          src={profile.avatar || defaultAvatar}
          alt={profile.name}
          className="profile-avatar w-20 h-20 md:w-[120px] md:h-[120px]"
        />
      </div>

      <div className="text-center w-full">
        <h1 className="profile-name text-xl md:text-[1.8rem] m-0 mb-1">
          {profile.name}
        </h1>
        <p className="profile-username text-sm md:text-base m-0 mb-2">
          @{profile.username}
        </p>

        {profile.bio && (
          <p className="profile-bio text-sm md:text-base my-2">
            {profile.bio}
          </p>
        )}

        {profile.location && (
          <p className="profile-location text-xs md:text-[0.95rem] my-1">
            {profile.location}
          </p>
        )}

        <div className="profile-stats flex flex-wrap justify-center gap-4 md:gap-16 mt-4 pt-4">
          <div className="stat-item">
            <span className="stat-number text-base md:text-[1.2rem]">
              {profile.postsCount || 0}
            </span>
            <span className="stat-label text-[0.7rem] md:text-[0.8rem]">
              Posts
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-number text-base md:text-[1.2rem]">
              {profile.followersCount || 0}
            </span>
            <span className="stat-label text-[0.7rem] md:text-[0.8rem]">
              Followers
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-number text-base md:text-[1.2rem]">
              {profile.followingCount || 0}
            </span>
            <span className="stat-label text-[0.7rem] md:text-[0.8rem]">
              Following
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;