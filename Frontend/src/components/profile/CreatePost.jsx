import React, { useState, useRef } from 'react';
import './CreatePost.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    image: null,
    description: '',
    location: ''
  });

  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
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

    setFormData(prev => ({
      ...prev,
      image: file
    }));
    setFileName(file.name);

    if (errors.image) {
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
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
      image: null
    }));
    setFileName('');
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
        description: '',
        location: ''
      });
      setFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="create-post p-4 md:p-8 mt-8">
      <h3 className="create-post-title pb-2 mb-4 md:mb-8">Create New Post</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-4">
          <label htmlFor="image" className="mb-1">Upload Image *</label>

          <div
            className={`drop-zone flex flex-col items-center justify-center min-h-[120px] md:min-h-[150px] p-4 md:p-8 ${
              isDragging ? 'dragging' : ''
            } ${errors.image ? 'error' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {fileName ? (
              <div className="file-info flex items-center gap-2 px-2 py-1 md:px-4 md:py-2">
                <span className="text-lg md:text-xl">📷</span>
                <span className="file-name text-sm md:text-[0.95rem] font-medium">
                  {fileName}
                </span>
                <button
                  type="button"
                  className="remove-file-btn px-1 text-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <p className="drop-zone-text text-sm md:text-base text-center m-0">
                Drag & drop your image here
                <br />
                <span className="drop-zone-subtext text-xs md:text-sm">
                  or click to browse
                </span>
              </p>
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

          {errors.image && (
            <span className="error-message mt-1">{errors.image}</span>
          )}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="description" className="mb-1">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`px-3 py-2 md:px-3.5 md:py-2.5 text-sm md:text-[0.95rem] ${
              errors.description ? 'error' : ''
            }`}
            placeholder="What's on your mind? (min 10 characters)"
            rows="3"
          />
          {errors.description && (
            <span className="error-message mt-1">{errors.description}</span>
          )}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="location" className="mb-1">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Where was this taken?"
            className="px-3 py-2 md:px-3.5 md:py-2.5 text-sm md:text-[0.95rem]"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full md:w-auto px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-[0.95rem]"
        >
          Share Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;