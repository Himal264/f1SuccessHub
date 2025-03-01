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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative bg-[#002349] text-white">
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

      {/* Updated grid container for larger cards */}
      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.length > 0 ? (
            stories.map((story) => (
              <Link
                key={story._id}
                to={`/stories/${story._id}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl relative h-full">
                  {/* Reduced image height from h-[300px] to h-[250px] */}
                  <div className="relative h-[250px]">
                    <img
                      src={story.photo?.url || assets.default_post_image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content section with more padding */}
                  <div className="p-8 relative">
                    {/* Author image and info */}
                    <div className="absolute -top-8 left-8">
                      <div className="flex flex-col items-center">
                        <img
                          src={story.author?.profilePicture?.url || assets.default_profile_icon}
                          alt={story.author?.name || 'Author'}
                          className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                        <div className="mt-2 text-center">
                          <div className="text-sm font-medium text-gray-900">
                            {story.author?.name || 'Anonymous'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(story.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Title and content */}
                    <div className="mt-12">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {story.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-6 text-base">
                        {story.subtitle}
                      </p>

                      {/* Updated tags and read time to be on the same line */}
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-2 flex-1">
                          {story.tags?.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                          {story.readTime || '5 min read'}
                        </div>
                      </div>
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
