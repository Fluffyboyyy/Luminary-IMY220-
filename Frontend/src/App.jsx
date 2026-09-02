import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashPage from './components/splash/SplashPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <main className="app-main">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/home" /> : <SplashPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;