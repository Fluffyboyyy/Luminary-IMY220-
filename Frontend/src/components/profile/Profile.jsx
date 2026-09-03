import React from 'react';
import './Profile.css';

const Profile = ({ profile, isOwnProfile }) => {
  const defaultAvatar = `https://ui-avatars.com/api/?name=${profile.name}&background=6C63FF&color=fff&size=120`;

  return (
    <div className="profile">
      <div className="profile-avatar-container">
        <img 
          src={profile.avatar || defaultAvatar} 
          alt={profile.name}
          className="profile-avatar"
        />
      </div>

      <div className="profile-info">
        <h1 className="profile-name">{profile.name}</h1>
        <p className="profile-username">@{profile.username}</p>
        
        {profile.bio && (
          <p className="profile-bio">{profile.bio}</p>
        )}
        
        {profile.location && (
          <p className="profile-location">{profile.location}</p>
        )}
        
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">{profile.postsCount || 0}</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{profile.followersCount || 0}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{profile.followingCount || 0}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;