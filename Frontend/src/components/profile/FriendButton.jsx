import React, { useState } from 'react';
import { api } from '../../api';
import './FriendButton.css';

const FriendButton = ({ userId, friendshipStatus, onStatusChange, requestId }) => {
  const [status, setStatus] = useState(friendshipStatus);
  const [isLoading, setIsLoading] = useState(false);

  const update = (newStatus) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  const handleSend = async () => {
    setIsLoading(true);
    try {
      await api(`/api/friends/request/${userId}`, { method: 'POST' });
      update('request_sent');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!requestId) {
      alert('Could not find the request to accept. Refresh the page.');
      return;
    }
    setIsLoading(true);
    try {
      await api(`/api/friends/accept/${requestId}`, { method: 'POST' });
      update('friends');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfriend = async () => {
    if (!window.confirm('Remove this user from your friends?')) return;
    setIsLoading(true);
    try {
      await api(`/api/friends/${userId}`, { method: 'DELETE' });
      update('not_friends');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const disabled = isLoading;

  if (status === 'friends') {
    return (
      <button
        className="friend-btn friend-btn-friends"
        onClick={handleUnfriend}
        disabled={disabled}
      >
        {isLoading ? '...' : 'Friends'}
      </button>
    );
  }

  if (status === 'request_sent') {
    return (
      <button className="friend-btn friend-btn-pending" disabled>
        Request Pending
      </button>
    );
  }

  if (status === 'request_received') {
    return (
      <button
        className="friend-btn friend-btn-accept"
        onClick={handleAccept}
        disabled={disabled}
      >
        {isLoading ? '...' : 'Accept Friend Request'}
      </button>
    );
  }

  return (
    <button
      className="friend-btn friend-btn-add"
      onClick={handleSend}
      disabled={disabled}
    >
      {isLoading ? '...' : '+ Add Friend'}
    </button>
  );
};

export default FriendButton;