import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import PostPage from './pages/PostPage';
import './App.css';

function App() {

  return (
    <Router>
      <div className="app">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/home" element={<FeedPage /> } />
            <Route path="/profile" element={<ProfilePage /> } />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/post/:postId" element={<PostPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;