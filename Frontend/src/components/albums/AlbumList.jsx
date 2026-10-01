import React, { useState, useCallback } from 'react';
import { api } from '../../api';
import AlbumCard from './AlbumCard';
import AlbumForm from './AlbumForm';
import './AlbumList.css';

const AlbumList = ({ albums, isOwnProfile, onAlbumsChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [error, setError] = useState('');

  const handleCreate = async (data) => {
    try {
      const res = await api('/api/albums', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      onAlbumsChange((prev) => [res.album, ...prev]);
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (data) => {
    try {
      const res = await api(`/api/albums/${editingAlbum._id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      onAlbumsChange((prev) =>
        prev.map((a) => (a._id === res.album._id ? res.album : a))
      );
      setEditingAlbum(null);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (album) => {
    if (
      !window.confirm(
        `Delete "${album.name}"? The posts inside will stay, but the album will be removed.`
      )
    )
      return;
    try {
      await api(`/api/albums/${album._id}`, { method: 'DELETE' });
      onAlbumsChange((prev) => prev.filter((a) => a._id !== album._id));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="album-list p-2 md:p-8 mt-8">
      <div className="album-list-header flex items-center justify-between pb-2 mb-4">
        <h3 className="text-base md:text-[1.3rem]">
          Albums ({albums.length})
        </h3>
        {isOwnProfile && !showForm && !editingAlbum && (
          <button
            className="btn btn-primary text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2"
            onClick={() => setShowForm(true)}
          >
            + New Album
          </button>
        )}
      </div>

      {error && (
        <p className="error-message mb-3">{error}</p>
      )}

      {showForm && (
        <AlbumForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingAlbum && (
        <AlbumForm
          initial={editingAlbum}
          onSubmit={handleUpdate}
          onCancel={() => setEditingAlbum(null)}
        />
      )}

      {albums.length === 0 && !showForm ? (
        <p className="text-center text-[color:var(--color-gray)] py-8 text-sm">
          {isOwnProfile
            ? "You haven't created any albums yet."
            : 'No albums to show.'}
        </p>
      ) : (
        <div className="album-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mt-4">
          {albums.map((album) => (
            <AlbumCard
              key={album._id}
              album={album}
              isOwnProfile={isOwnProfile}
              onEdit={setEditingAlbum}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumList;