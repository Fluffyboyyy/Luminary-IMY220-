import React, { useState } from 'react';
import './EditPost.css';

const EditPost = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    description: post?.description || '',
    hashtagsInput: (post?.hashtags || []).join(', '),
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const hashtags = formData.hashtagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, '').toLowerCase())
        .filter((t) => t.length > 0);

      await onSave({
        description: formData.description,
        hashtags,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) {
    return (
      <div className="edit-post-not-found p-8 text-center">
        <p>Post not found</p>
        <button className="btn btn-primary mt-4" onClick={onCancel}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="edit-post p-4 md:p-8 mt-8">
      <h3 className="edit-post-title pb-2 mb-4 md:mb-8">Edit Post</h3>
      <form onSubmit={handleSubmit}>
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
            rows="4"
          />
          {errors.description && (
            <span className="error-message mt-1">{errors.description}</span>
          )}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="hashtagsInput" className="mb-1">
            Hashtags (comma separated)
          </label>
          <input
            type="text"
            id="hashtagsInput"
            name="hashtagsInput"
            value={formData.hashtagsInput}
            onChange={handleChange}
            className="px-3 py-2 md:px-3.5 md:py-2.5 text-sm md:text-[0.95rem]"
            placeholder="nature, sunset, beach"
          />
        </div>

        <div className="edit-post-actions flex flex-col md:flex-row gap-2 md:gap-4 mt-4">
          <button
            type="button"
            className="btn btn-secondary px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-[0.95rem]"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-[0.95rem]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;