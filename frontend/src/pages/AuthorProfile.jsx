import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import assets from "../assets/assets";

const AuthorProfile = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [stories, setStories] = useState([]);
  const [activeType, setActiveType] = useState("all");
  const [error, setError] = useState(null);

  // Story type navigation items
  const storyTypes = [
    { id: 'all', label: 'View All' },
    { id: 'student', label: 'Students' },
    { id: 'university', label: 'University' },
    { id: 'study in usa', label: 'Study in USA' },
    { id: 'news', label: 'News' },
  ];

  useEffect(() => {
    const fetchAuthorAndStories = async () => {
      try {
        // Fetch author details
        const authorResponse = await axios.get(`/api/users/${authorId}`);
        setAuthor(authorResponse.data.user);

        // Fetch author's stories
        const storiesResponse = await axios.get(`/api/stories/author/${authorId}`);
        const filteredStories = activeType === 'all' 
          ? storiesResponse.data.stories 
          : storiesResponse.data.stories.filter(story => story.storyType === activeType);
        
        setStories(filteredStories);
      } catch (error) {
        console.error('Error fetching author data:', error);
        setError('Failed to load author profile');
      }
    };

    fetchAuthorAndStories();
  }, [authorId, activeType]);

  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!author) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Author Hero Section */}
      <div className="relative bg-[#2A3342] text-white rounded-xl overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center gap-8">
            <img
              src={author.profilePicture?.url || assets.default_profile_icon}
              alt={author.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div>
              <h1 className="text-4xl font-serif font-bold mb-4">
                {author.name}
              </h1>
              <p className="text-lg text-gray-300">
                {author.role === 'counselor' && author.counselorInfo?.bio}
                {author.role === 'alumni' && author.alumniInfo?.bio}
                {author.role === 'university' && author.universityInfo?.bio}
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4 mt-4">
                {author.role === 'counselor' && author.counselorInfo?.socialLinks && (
                  Object.entries(author.counselorInfo.socialLinks).map(([platform, link]) => (
                    link && <a key={platform} href={link} target="_blank" rel="noopener noreferrer" 
                      className="text-white hover:text-[#F37021]">
                      {platform}
                    </a>
                  ))
                )}
                {/* Add similar conditions for alumni and university roles */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="sticky top-0 bg-white shadow-sm z-10 mt-8">
        <div className="max-w-6xl mx-auto">
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
                  <div className="relative h-[250px]">
                    <img
                      src={story.photo?.url || assets.default_post_image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-base">
                      {story.subtitle}
                    </p>

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

export default AuthorProfile; 