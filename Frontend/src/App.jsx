import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import PostPage from './pages/PostPage';
import CreatePost from './components/profile/CreatePost';
import Navigation from './components/basic/Navigation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/*" element={
            <>
              <Navigation />
              <main className="app-main">
                <Routes>
                  <Route path="/home" element={<FeedPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/:userId" element={<ProfilePage />} />
                  <Route path="/post/:postId" element={<PostPage />} />
                  <Route path="/create" element={<CreatePost />} />
                </Routes>
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;