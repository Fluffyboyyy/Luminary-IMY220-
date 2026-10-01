import React, { useState } from 'react';
import './EditProfile.css';

const EditProfile = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    username: profile.username || '',
    bio: profile.bio || '',
    location: profile.location || '',
    email: profile.email || ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.username.trim() || formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email must contain @';
    }

    if (formData.bio && formData.bio.length > 150) {
      newErrors.bio = 'Bio must be 150 characters or less';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    if (validate()) {
      console.log('Profile updated:', formData);
      alert('Profile updated successfully!');
      setIsSubmitted(false);
    }
  };

  return (
    <div className="edit-profile p-4 md:p-8 mt-8">
      <h3 className="edit-profile-title pb-2 mb-4 md:mb-8">Edit Profile</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-4">
          <label htmlFor="name" className="mb-1">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`px-3 py-2 md:px-3.5 md:py-2.5 text-sm md:text-[0.95rem] ${
              errors.name ? 'error' : ''
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && <span className="error-message mt-1">{errors.name}</span>}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="username" className="mb-1">Username *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`px-3 py-2 md:px-3.5 md:py-2.5 text-sm md:text-[0.95rem] ${
              errors.username ? 'error' : ''
            }`}
            placeholder="Enter your username"
          />
          {errors.username && (
            <span className="error-message mt-1">{errors.username}</span>
          )}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="email" className="mb-1">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`px-3 py-2 md:px-3.5 md:py-2.5 text-sm md:text-[0.95rem] ${
              errors.email ? 'error' : ''
            }`}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error-message mt-1">{errors.email}</span>}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="location" className="mb-1">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter your location"
            className="px-3 py-2 md:px-3.5 md:py-2.5 text-sm md:text-[0.95rem]"
          />
        </div>

        <div className="form-group mb-4">
          <label htmlFor="bio" className="mb-1">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className={`px-3 py-2 md:px-3.5 md:py-2.5 text-sm md:text-[0.95rem] ${
              errors.bio ? 'error' : ''
            }`}
            placeholder="Tell us about yourself (max 150 characters)"
            maxLength="150"
            rows="3"
          />
          <span className="char-count mt-1">{formData.bio.length}/150</span>
          {errors.bio && <span className="error-message mt-1">{errors.bio}</span>}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full md:w-auto px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-[0.95rem]"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;