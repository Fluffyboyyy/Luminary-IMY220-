import React, { useState } from 'react';
import LoginForm from '../components/splash/LoginForm';
import RegisterForm from '../components/splash/RegisterForm';
import './SplashPage.css';

const SplashPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="splash-page">
      <div className="flex flex-col lg:flex-row w-full min-h-screen">
        <div className="flex-[1.2] flex flex-col min-h-auto lg:min-h-screen">
          <section className="hero-section flex-1 flex items-center justify-start px-6 py-8 lg:px-24 lg:py-12">
            <div className="hero-content">
              <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl mb-2">
                Luminary
              </h1>
              <p className="hero-tagline text-lg sm:text-xl lg:text-2xl mb-4">
                Where Every Moment Shines
              </p>
              <p className="hero-description text-sm sm:text-base mb-6 lg:mb-8">
                Share your story through photos. Connect with friends.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-start">
                <button
                  className="btn btn-primary px-5 py-2.5 lg:px-8 lg:py-3.5 text-xs lg:text-base"
                  onClick={() => setShowLogin(true)}
                >
                  Sign In
                </button>
                <button
                  className="btn btn-secondary px-5 py-2.5 lg:px-8 lg:py-3.5 text-xs lg:text-base"
                  onClick={() => setShowLogin(false)}
                >
                  Get Started
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="right-column flex-[0.8] flex items-center justify-center px-4 py-8 lg:px-8 lg:py-8 min-h-auto lg:min-h-screen">
          <section className="w-full flex items-center justify-center">
            <div className="auth-container w-full max-w-full sm:max-w-[440px] p-5 sm:p-6 lg:p-10">
              <div className="auth-header mb-6">
                <h2 className="auth-title text-xl lg:text-2xl mb-1">
                  {showLogin ? 'Welcome Back!' : 'Join Luminary'}
                </h2>
                <p className="auth-subtitle text-xs lg:text-sm">
                  {showLogin
                    ? 'Sign in to continue sharing your moments'
                    : 'Create your account and start sharing your story'}
                </p>
              </div>

              <div className="auth-tabs flex mb-6">
                <button
                  className={`auth-tab flex-1 px-1 py-2 lg:py-3 text-xs lg:text-sm ${
                    showLogin ? 'active' : ''
                  }`}
                  onClick={() => setShowLogin(true)}
                >
                  Sign In
                </button>
                <button
                  className={`auth-tab flex-1 px-1 py-2 lg:py-3 text-xs lg:text-sm ${
                    !showLogin ? 'active' : ''
                  }`}
                  onClick={() => setShowLogin(false)}
                >
                  Create Account
                </button>
              </div>

              <div className="py-1">
                {showLogin ? (
                  <LoginForm onSwitchToRegister={() => setShowLogin(false)} />
                ) : (
                  <RegisterForm onSwitchToLogin={() => setShowLogin(true)} />
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;