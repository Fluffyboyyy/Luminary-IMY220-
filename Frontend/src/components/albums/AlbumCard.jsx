import React from 'react';
import { Link } from 'react-router-dom';
import './AlbumCard.css';

const AlbumCard = ({ album, isOwnProfile, onEdit, onDelete }) => {
  const cover = album.coverImage || album.posts?.[0]?.image || '';

  return (
    <div className="album-card">
      <Link to={`/album/${album._id}`} className="album-cover-link">
        <div className="album-cover-wrapper">
          {cover ? (
            <img src={cover} alt={album.name} className="album-cover" />
          ) : album.name}
        </div>
      </Link>

      <div className="album-card-info p-2 md:p-3">
        <Link to={`/album/${album._id}`} className="album-name-link">
          <h4 className="album-name text-sm md:text-base">{album.name}</h4>
        </Link>
        {album.description && (
          <p className="album-description text-xs md:text-sm">
            {album.description}
          </p>
        )}
        <p className="album-count text-xs">
          {album.posts?.length || 0}{' '}
          {album.posts?.length === 1 ? 'post' : 'posts'}
        </p>

        {isOwnProfile && (
          <div className="album-actions flex gap-2 mt-2">
            <button
              onClick={() => onEdit(album)}
              className="album-action-btn text-xs"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(album)}
              className="album-action-btn album-action-danger text-xs"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumCard;