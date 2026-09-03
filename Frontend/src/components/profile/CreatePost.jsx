import React, { useState, useRef } from 'react';
import './CreatePost.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    image: null, 
    imagePreview: null, 
    description: '',
    location: ''
  });

  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.image) {
      newErrors.image = 'Image is required';
    } else if (!formData.image.type.startsWith('image/')) {
      newErrors.image = 'Please upload a valid image file';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };


  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        image: 'Please upload a valid image file (JPEG, PNG, GIF, etc.)'
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: reader.result
      }));

      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      console.log('Post created:', {
        image: formData.image,
        description: formData.description,
        location: formData.location
      });
      alert('Post created successfully!');
      
      setFormData({
        image: null,
        imagePreview: null,
        description: '',
        location: ''
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="create-post">
      <h3 className="create-post-title">Create New Post</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="image">Upload Image *</label>
          
          <div
            className={`drop-zone ${isDragging ? 'dragging' : ''} ${errors.image ? 'error' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {formData.imagePreview ? (
              <div className="image-preview-container">
                <img 
                  src={formData.imagePreview} 
                  alt="Preview" 
                  className="image-preview"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <>
                <p className="drop-zone-text">
                  Drag & drop your image here<br />
                  <span className="drop-zone-subtext">or click to browse</span>
                </p>
              </>
            )}
          </div>

          <input
            type="file"
            id="image"
            name="image"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden-file-input"
          />
          
          {errors.image && <span className="error-message">{errors.image}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
            placeholder="What's on your mind? (min 10 characters)"
            rows="3"
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Where was this taken?"
          />
        </div>

        <button type="submit" className="btn btn-primary">Share Post</button>
      </form>
    </div>
  );
};

export default CreatePost;