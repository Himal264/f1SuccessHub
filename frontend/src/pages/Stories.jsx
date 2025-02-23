import React, { useState, useEffect } from "react";
import axios from "axios";
import Stories1AskAdvisor from '../components/Stories1AskAdvisor';
import Stories2FindSchool from '../components/Stories2FindSchool';
import { Link } from "react-router-dom";
import assets from "../assets/assets";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [activeType, setActiveType] = useState("all");
  const [error, setError] = useState(null);

  // Hero image mapping based on story type
  const heroImages = {
    'all': assets.alllandings,
    'student': assets.student_career,
    'university': assets.NewLandingpage,
    'study in usa': assets.korean_studetn,
    'news': assets.fatimah,
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
        let url = '/api/stories';
        let params = {};
        
        if (activeType !== 'all') {
          params.storyType = activeType;
        }

        const { data } = await axios.get(url, { params });

        if (data.success) {
          const filteredStories = activeType === 'all' 
            ? data.stories 
            : data.stories.filter(story => story.storyType === activeType);

          setStories(filteredStories);
        } else {
          setError(data.message || 'Failed to fetch stories');
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
        setError('An error occurred while fetching stories.');
      }
    };

    fetchStories();
  }, [activeType]);

  // Story type navigation items
  const storyTypes = [
    { id: 'all', label: 'View All' },
    { id: 'student', label: 'Students' },
    { id: 'university', label: 'University' },
    { id: 'study in usa', label: 'Study in USA' },
    { id: 'news', label: 'News' },
  ];

  // Add styles for story content
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .story-content {
        font-size: 1.125rem;
        line-height: 1.75;
        color: #4B5563; /* Consistent text color */
      }
      
      /* Headers */
      .story-content h1 {
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
        color: #2A3342;
        font-family: serif;
      }
      
      .story-content h2 {
        font-size: 2rem;
        margin-bottom: 1.25rem;
        color: #2A3342;
        font-family: serif;
      }
      
      .story-content h3 {
        font-size: 1.75rem;
        margin-bottom: 1rem;
        color: #2A3342;
        font-family: serif;
      }
      
      /* Paragraphs and spacing */
      .story-content p {
        margin-bottom: 1.5rem;
        color: #4B5563;
      }
      
      /* Lists */
      .story-content ul, .story-content ol {
        margin-bottom: 1.5rem;
        padding-left: 2rem;
      }
      
      .story-content li {
        margin-bottom: 0.5rem;
        color: #4B5563;
      }
      
      /* Links */
      .story-content a {
        color: #2A3342;
        text-decoration: underline;
        text-decoration-color: #F37021;
        text-underline-offset: 2px;
      }
      
      .story-content a:hover {
        color: #F37021;
        transition: color 0.3s ease;
      }
      
      /* Images */
      .story-content img {
        margin: 50px auto;
        max-width: calc(100% - 100px);
        height: auto;
        display: block;
        border-radius: 8px;
      }
      
      /* Blockquotes */
      .story-content blockquote {
        border-left: 4px solid #F37021;
        padding-left: 1rem;
        margin-left: 0;
        margin-right: 0;
        margin-bottom: 1.5rem;
        font-style: italic;
        color: #6B7280;
      }
      
      /* Tables */
      .story-content table {
        width: 100%;
        margin-bottom: 1.5rem;
        border-collapse: collapse;
      }
      
      .story-content table td,
      .story-content table th {
        border: 1px solid #E5E7EB;
        padding: 0.75rem;
      }
      
      .story-content table th {
        background-color: #F9FAFB;
        color: #2A3342;
      }
      
      /* Code blocks */
      .story-content pre {
        background-color: #F9FAFB;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        overflow-x: auto;
      }
      
      .story-content code {
        font-family: monospace;
        color: #2A3342;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-[#2A3342] text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                Stories That Matter
              </h1>
              <p className="text-lg text-gray-300 mb-6">
                Discover inspiring stories from international students, universities, 
                and stay updated with the latest news in US education.
              </p>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <img 
                src={heroImages[activeType]} 
                alt="Stories Hero"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex overflow-x-auto">
            {storyTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeType === type.id
                    ? 'border-[#F37021] text-[#F37021]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {type.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(stories) && stories.length > 0 ? (
            stories.map((story) => (
              <Link to={`/stories/${story._id}`} key={story._id}>
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  {story.photo && (
                    <div className="relative">
                      <img 
                        src={story.photo.url} 
                        alt={story.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {/* Author Profile Picture - Overlapping */}
                      <div className="absolute -bottom-6 left-4">
                        <img 
                          src={story.author?.profilePicture?.url || assets.default_profile_icon} 
                          alt={story.author?.name || 'Author'}
                          className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Story Content */}
                  <div className="p-4 pt-8">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {story.author?.name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(story.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {story.readTime || '5 min read'}
                      </div>
                    </div>

                    <h2 className="text-xl font-serif font-semibold mb-2">
                      {story.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {story.subtitle}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {story.tags?.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Story Type Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 text-gray-800 rounded-full text-sm font-medium">
                        {story.storyType}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No stories found for {activeType === 'all' ? 'any category' : `the ${activeType} category`}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stories;
