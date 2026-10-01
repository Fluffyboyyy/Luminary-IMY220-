import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import './AlbumPicker.css';

const AlbumPicker = ({ postId, onClose, onAdded }) => {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await api('/api/auth/me');
        const data = await api(`/api/users/${me._id}`);
        if (!cancelled) setAlbums(data.albums || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load albums');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Add OR remove, depending on whether the post is already in the album
  const handleToggle = async (albumId, alreadyIn) => {
    setSubmittingId(albumId);
    try {
      if (alreadyIn) {
        await api(`/api/albums/${albumId}/posts/${postId}`, {
          method: 'DELETE',
        });
      } else {
        await api(`/api/albums/${albumId}/posts`, {
          method: 'POST',
          body: JSON.stringify({ postId }),
        });
      }
      onAdded?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update album');
      setSubmittingId(null);
    }
  };

  return (
    <div className="album-picker-overlay" onClick={onClose}>
      <div
        className="album-picker-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="album-picker-header flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg">Add to Album</h3>
          <button
            className="album-picker-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {isLoading && (
          <p className="text-center text-sm text-[color:var(--color-gray)] py-6">
            Loading albums...
          </p>
        )}

        {error && (
          <p className="text-center text-sm text-[color:var(--color-secondary)] py-2">
            {error}
          </p>
        )}

        {!isLoading && albums.length === 0 && (
          <p className="text-center text-sm text-[color:var(--color-gray)] py-6">
            You don't have any albums yet. Create one from your profile page.
          </p>
        )}

        {!isLoading && albums.length > 0 && (
          <div className="album-picker-list flex flex-col gap-2">
            {albums.map((album) => {
              const cover =
                album.coverImage || album.posts?.[0]?.image || '';
              const alreadyIn = (album.posts || []).some(
                (p) => (typeof p === 'string' ? p : p._id) === postId
              );
              const isSubmitting = submittingId === album._id;

              return (
                <button
                  key={album._id}
                  onClick={() => handleToggle(album._id, alreadyIn)}
                  disabled={isSubmitting}
                  className={`album-picker-item flex items-center gap-3 p-2 ${
                    alreadyIn ? 'already-in' : ''
                  }`}
                >
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold">
                      {album.name}
                    </div>
                    <div className="text-xs text-[color:var(--color-gray)]">
                      {album.posts?.length || 0}{' '}
                      {album.posts?.length === 1 ? 'post' : 'posts'}
                    </div>
                  </div>
                  {isSubmitting ? (
                    <span className="text-xs text-[color:var(--color-primary)]">
                      ...
                    </span>
                  ) : alreadyIn ? (
                    <span className="text-xs text-[color:var(--color-secondary)] font-semibold">
                      Remove
                    </span>
                  ) : (
                    <span className="text-xs text-[color:var(--color-primary)] font-semibold">
                      Add
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumPicker;