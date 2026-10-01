import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import '../components/profile/FriendButton.css';
import './FriendRequestsPage.css';

const FriendRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api('/api/friends/requests');
      setRequests(data.requests || []);
    } catch (err) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    setActionId(requestId);
    try {
      await api(`/api/friends/accept/${requestId}`, { method: 'POST' });
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      alert(err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleDecline = async (requestId) => {
    setActionId(requestId);
    try {
      await api(`/api/friends/decline/${requestId}`, { method: 'POST' });
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      alert(err.message);
    } finally {
      setActionId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block w-10 h-10 border-4 border-[color:var(--color-gray-light)] border-t-[color:var(--color-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[700px] mx-auto p-4 md:p-8 min-h-screen">
      <h1 className="text-2xl md:text-3xl mb-6 text-center">
        Friend Requests
      </h1>

      {error && (
        <p className="text-center text-[color:var(--color-secondary)] py-4">
          {error}
        </p>
      )}

      {requests.length === 0 ? (
        <p className="text-center text-[color:var(--color-gray)] py-8">
          You have no pending friend requests.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((request) => {
            const u = request.from;
            const isActing = actionId === request._id;

            return (
              <div
                key={request._id}
                className="friend-request-row flex flex-col sm:flex-row items-center gap-3 p-3"
              >
                <Link
                  to={`/profile/${u._id}`}
                  className="flex items-center gap-3 flex-1 no-underline text-inherit w-full"
                >
                  <img
                    src={
                      u.profileImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        u.name
                      )}&background=6C63FF&color=fff&size=48`
                    }
                    alt={u.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm md:text-base">
                      {u.name}
                    </span>
                    <span className="text-xs md:text-sm text-[color:var(--color-gray)]">
                      @{u.username}
                    </span>
                  </div>
                </Link>

                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <button
                    className="friend-btn friend-btn-accept"
                    onClick={() => handleAccept(request._id)}
                    disabled={isActing}
                  >
                    {isActing ? '...' : 'Accept'}
                  </button>
                  <button
                    className="friend-btn friend-btn-pending"
                    onClick={() => handleDecline(request._id)}
                    disabled={isActing}
                  >
                    Decline
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FriendRequestsPage;