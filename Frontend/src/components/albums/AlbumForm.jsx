import React, { useState } from 'react';
import './AlbumForm.css';

const AlbumForm = ({ initial, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    hashtagsInput: (initial?.hashtags || []).join(', '),
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.name.length > 100)
      newErrors.name = 'Name must be 100 characters or less';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const hashtags = formData.hashtagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, '').toLowerCase())
      .filter((t) => t.length > 0);

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
        hashtags,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="album-form p-4 md:p-6">
      <h3 className="text-base md:text-lg mb-4">
        {initial ? 'Edit Album' : 'New Album'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-4">
          <label htmlFor="name" className="mb-1">Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`px-3 py-2 text-sm w-full ${
              errors.name ? 'error' : ''
            }`}
            placeholder="e.g. Summer 2026"
            maxLength="100"
          />
          {errors.name && (
            <span className="error-message mt-1">{errors.name}</span>
          )}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="description" className="mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="px-3 py-2 text-sm w-full"
            placeholder="What's this album about?"
            rows="2"
          />
        </div>

        <div className="form-group mb-4">
          <label htmlFor="hashtagsInput" className="mb-1">
            Hashtags (comma separated)
          </label>
          <input
            id="hashtagsInput"
            name="hashtagsInput"
            type="text"
            value={formData.hashtagsInput}
            onChange={handleChange}
            className="px-3 py-2 text-sm w-full"
            placeholder="summer, beach, travel"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            type="submit"
            className="btn btn-primary px-5 py-2.5 text-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : initial ? 'Save Changes' : 'Create Album'}
          </button>
          <button
            type="button"
            className="btn btn-secondary px-5 py-2.5 text-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlbumForm;