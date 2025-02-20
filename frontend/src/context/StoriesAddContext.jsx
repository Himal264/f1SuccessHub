import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const StoriesAddContext = createContext();

export const StoriesAddProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createStory = async (storyData) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('title', storyData.title);
      formData.append('subtitle', storyData.subtitle);
      formData.append('content', storyData.content);
      formData.append('storyType', storyData.storyType);
      storyData.tags.forEach(tag => formData.append('tags', tag));
      if (storyData.photo) {
        formData.append('photo', storyData.photo);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const { data } = await axios.post('/api/stories', formData, config);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStory = async (id, storyData) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('title', storyData.title);
      formData.append('subtitle', storyData.subtitle);
      formData.append('content', storyData.content);
      formData.append('storyType', storyData.storyType);
      storyData.tags.forEach(tag => formData.append('tags', tag));
      if (storyData.photo) {
        formData.append('photo', storyData.photo);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const { data } = await axios.put(`/api/stories/${id}`, formData, config);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <StoriesAddContext.Provider
      value={{
        loading,
        error,
        createStory,
        updateStory,
      }}
    >
      {children}
    </StoriesAddContext.Provider>
  );
};

export const useStoriesAdd = () => {
  const context = useContext(StoriesAddContext);
  if (!context) {
    throw new Error('useStoriesAdd must be used within a StoriesAddProvider');
  }
  return context;
};

export default StoriesAddContext;