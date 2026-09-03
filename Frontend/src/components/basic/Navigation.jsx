import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/home" className="nav-logo">
            <span className="logo-icon">✦</span>
            Luminary
          </Link>
        </div>

        <div className="nav-actions">
          <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
            Profile
          </Link>
          <Link to="/create" className="nav-btn nav-create">
            + New Post
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;