import React from 'react';
import { useParams } from 'react-router-dom';
import Profile from '../components/profile/Profile';
import EditProfile from '../components/profile/EditProfile';
import PostList from '../components/profile/PostList';
import CreatePost from '../components/profile/CreatePost';
import FriendList from '../components/profile/FriendList';
import './ProfilePage.css';

const ProfilePage = () => {
  const { userId } = useParams();
  
  const profileData = {
    id: userId || '1',
    name: 'John Doe',
    username: 'johndoe',
    bio: 'Photography enthusiast',
    email: 'john@example.com',
    location: 'New York, USA',
    joinDate: new Date('2024-01-15'),
    postsCount: 12,
    followersCount: 156,
    followingCount: 89,
    isOwnProfile: true
  };

  const friendsData = [
    {
      id: 2,
      name: 'Jane Smith',
      username: 'janesmith',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=FF6584&color=fff&size=60'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      username: 'mikej',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=00D4AA&color=fff&size=60'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      username: 'swilson',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=FFB347&color=fff&size=60'
    },
    {
      id: 5,
      name: 'Tom Brown',
      username: 'tombrown',
      avatar: 'https://ui-avatars.com/api/?name=Tom+Brown&background=6C63FF&color=fff&size=60'
    },
    {
      id: 6,
      name: 'Emily Davis',
      username: 'emilyd',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=FF6584&color=fff&size=60'
    },
    {
      id: 7,
      name: 'Chris Lee',
      username: 'chrislee',
      avatar: 'https://ui-avatars.com/api/?name=Chris+Lee&background=00D4AA&color=fff&size=60'
    }
  ];

  const postsData = [
    {
      id: 1,
      image: 'https://picsum.photos/seed/1/600/350',
      description: 'Beautiful sunset at the beach',
      likes: 42,
      comments: 5,
      createdAt: new Date('2024-08-28')
    },
    {
      id: 2,
      image: 'https://picsum.photos/seed/2/600/350',
      description: 'New art project in progress',
      likes: 28,
      comments: 3,
      createdAt: new Date('2024-08-27')
    },
    {
      id: 3,
      image: 'https://picsum.photos/seed/3/600/350',
      description: 'Coffee and coding',
      likes: 56,
      comments: 8,
      createdAt: new Date('2024-08-26')
    }
  ];

  return (
    <div className="profile-page">
      <div className="profile-container">
        <Profile profile={profileData} isOwnProfile={profileData.isOwnProfile} />
        
        <EditProfile profile={profileData} />
        
        <CreatePost />
        
        <FriendList friends={friendsData} isOwnProfile={profileData.isOwnProfile} />
        
        <PostList posts={postsData} isOwnProfile={profileData.isOwnProfile} />
      </div>
    </div>
  );
};

export default ProfilePage;