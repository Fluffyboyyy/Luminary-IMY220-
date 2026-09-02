import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './SplashPage.css';

const SplashPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="splash-page">
      <div className="splash-container">
        <div className="left-column">
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">Luminary</h1>
              <p className="hero-tagline">Where Every Moment Shines</p>
              <p className="hero-description">
                Share your story through photos. Connect with friends.
              </p>
              <div className="hero-actions">
                <button
                  className="btn btn-primary btn-large"
                  onClick={() => setShowLogin(true)}
                >
                  Sign In
                </button>
                <button
                  className="btn btn-secondary btn-large"
                  onClick={() => setShowLogin(false)}
                >
                  Get Started
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="right-column">
          <section className="auth-section">
            <div className="auth-container">
              <div className="auth-header">
                <h2 className="auth-title">{showLogin ? 'Welcome Back!' : 'Join Luminary'}</h2>
                <p className="auth-subtitle">
                  {showLogin
                    ? 'Sign in to continue sharing your moments'
                    : 'Create your account and start sharing your story'}
                </p>
              </div>
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${showLogin ? 'active' : ''}`}
                  onClick={() => setShowLogin(true)}
                >
                  Sign In
                </button>
                <button
                  className={`auth-tab ${!showLogin ? 'active' : ''}`}
                  onClick={() => setShowLogin(false)}
                >
                  Create Account
                </button>
              </div>
              <div className="auth-form-container">
                {showLogin ? <LoginForm /> : <RegisterForm />}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;