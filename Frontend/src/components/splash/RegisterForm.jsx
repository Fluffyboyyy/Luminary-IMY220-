import React, { useState } from 'react';
import './AuthForms.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!formData.name.trim()) {
      setError('Full name is required');
      return;
    }
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (!formData.email) {
      setError('Email is required');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          placeholder="Choose a username"
          required
          minLength="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password (min 6 characters)"
          required
          minLength="6"
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
        />
      </div>

      {error && <div className="form-error">{error}</div>}

      <button 
        type="submit" 
        className="btn btn-primary btn-block"
      >
        {'Create Account'}
      </button>

      <p className="form-footer-text">
        Already have an account?{' '}
        <button 
          type="button" 
          className="link-btn"
          onClick={() => {
            document.querySelector('.auth-tab:first-child')?.click();
          }}
        >
          Sign In
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;