import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = async () => {
  await fetch('http://localhost:5000/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  window.location.href = '/';
};

  return (
    <nav className="main-nav">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-12 md:h-14 lg:h-16 flex items-center justify-between">
        <div className="nav-brand">
          <Link to="/home" className="nav-logo flex items-center gap-2">
            <span className="text-lg md:text-2xl">✦</span>
            Luminary
          </Link>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <Link
            to="/home"
            className={`nav-link text-xs md:text-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 ${
              isActive('/home') ? 'active' : ''
            }`}
          >
            Home
          </Link>
          <Link
            to="/profile"
            className={`nav-link text-xs md:text-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 ${
              isActive('/profile') ? 'active' : ''
            }`}
          >
            Profile
          </Link>
          <Link
            to="/create"
            className="nav-btn nav-create rounded-full text-xs md:text-sm px-3 py-1.5 md:px-5 md:py-2"
          >
            + New Post
          </Link>
          <button onClick={handleLogout} className="nav-link text-xs md:text-sm rounded-full px-3 py-1.5 md:px-4 md:py-2">
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;