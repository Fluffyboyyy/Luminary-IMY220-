import React, { useState } from 'react';
import './AuthForms.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="login-email">Email Address</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          minLength="6"
        />
      </div>

      {error && <div className="form-error">{error}</div>}

      <button 
        type="submit" 
        className="btn btn-primary btn-block"
  
      >
        {'Sign In'}
      </button>

      <p className="form-footer-text">
        Don't have an account?{' '}
        <button 
          type="button" 
          className="link-btn"
          onClick={() => {
            document.querySelector('.auth-tab:last-child')?.click();
          }}
        >
          Sign Up
        </button>
      </p>
    </form>
  );
};

export default LoginForm;