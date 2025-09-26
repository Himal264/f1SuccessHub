import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import assets from '../assets/assets';
import { backendUrl } from '../App';

const StoryUniversityCard = ({ universityName }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchStories = async () => {
      try {
        // First try to fetch university-specific stories
        const uniResponse = await axios.get(`${backendUrl}/api/stories/university/${encodeURIComponent(universityName)}`);
        
        if (uniResponse.data.success && uniResponse.data.stories.length > 0) {
          setStories(uniResponse.data.stories);
        } else {
          // If no university stories, fetch recent news stories
          const newsResponse = await axios.get(`/api/stories`, {
            params: {
              storyType: 'news',
              limit: 3
            }
          });
          
          if (newsResponse.data.success) {
            setStories(newsResponse.data.stories);
          }
        }
      } catch (err) {
        setError('Failed to fetch stories');
        console.error('Error fetching stories:', err);
      } finally {
        setLoading(false);
      }
    };

    if (universityName) {
      fetchStories();
    }
  }, [universityName]);

  if (loading) return <div className="text-center py-4">Loading stories...</div>;
  if (error) return null;
  if (stories.length === 0) return null;

  const sectionTitle = stories.some(story => story.tags?.includes(universityName))
    ? `Stories about ${universityName}`
    : "Recent News & Announcements";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        {sectionTitle}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Link
            key={story._id}
            to={`/stories/${story._id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl h-full">
              <div className="relative h-48">
                <img
                  src={story.photo?.url || assets.default_post_image}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
                {story.storyType === 'news' && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                    News
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={story.author?.profilePicture?.url || assets.default_profile_icon}
                    alt={story.author?.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {story.author?.name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(story.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {story.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {story.subtitle}
                </p>

                <div className="flex flex-wrap gap-2">
                  {story.tags?.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StoryUniversityCard;