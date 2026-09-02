import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashPage from './components/splash/SplashPage';
import FeedPage from './components/feed/FeedPage';
import './App.css';

function App() {

  return (
    <Router>
      <div className="app">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/home" element={<FeedPage /> } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;