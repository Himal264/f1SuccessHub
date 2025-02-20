import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoriesAdd } from '../context/StoriesAddContext';

const StoriesAdd = () => {
  const navigate = useNavigate();
  const { createStory, loading, error } = useStoriesAdd();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    storyType: '',
    tags: [],
    photo: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [tagInput, setTagInput] = useState('');

  const storyTypes = ['student', 'university', 'study in usa', 'news'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStory(formData);
      navigate('/stories'); // Redirect to stories list after successful creation
    } catch (err) {
      console.error('Error creating story:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Story</h2>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Story Type</label>
          <select
            name="storyType"
            value={formData.storyType}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select a type</option>
            {storyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className="w-full border rounded p-2 h-32"
            maxLength={2000}
            required
          />
          <div className="text-sm text-gray-500">
            {formData.content.length}/2000 characters
          </div>
        </div>

        <div>
          <label className="block mb-1">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 border rounded p-2"
              placeholder="Add a tag"
            />
            <button
              onClick={handleTagAdd}
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="bg-gray-200 px-2 py-1 rounded flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full border rounded p-2"
            required
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-2 max-w-xs rounded"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Creating...' : 'Create Story'}
        </button>
      </form>
    </div>
  );
};

export default StoriesAdd;
