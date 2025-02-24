import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Stories1AskAdvisor from "../components/Stories1AskAdvisor";
import Stories2FindSchool from "../components/Stories2FindSchool";
import Footer from "../components/Footer";
import assets from "../assets/assets";

// Add this CSS at the top of your component or in a separate CSS file
const storyContentStyles = `
  .story-content a {
    text-decoration: underline;
    text-decoration-color: #F37021;
    text-decoration-thickness: 1px;
    color: #2A3342;
    transition: color 0.2s ease;
  }
  
  .story-content a:hover {
    color: #F37021;
  }
`;

const StoriesDetail = () => {
  const [story, setStory] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const { data } = await axios.get(`/api/stories/${id}`);
        if (data.success) {
          setStory(data.story);
          console.log('Story data:', data.story);
        } else {
          setError(data.message || "Failed to fetch story");
        }
      } catch (error) {
        console.error("Error fetching story:", error);
        setError("An error occurred while fetching the story.");
      }
    };

    fetchStory();
  }, [id]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!story) return <div>Loading...</div>;

  return (
    <div className="bg-gray-50">
      {/* Add the styles to the page */}
      <style>{storyContentStyles}</style>

      <div className="max-w-6xl mx-auto">
        {/* Add Breadcrumb Navigation */}
        <div className="py-4">
          <div className="flex items-center text-xl">
            <span 
              onClick={() => navigate('/stories')} 
              className="text-gray-600 hover:text-[#F37021] cursor-pointer"
            >
              Stories
            </span>
            <span className="mx-2 text-gray-400">{'>'}</span>
            <span className="text-gray-600">{story.storyType}</span>
          </div>
        </div>

        {/* Title and Image Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* Left side - Title and Content */}
          <div>
            <h1 className="text-[52px] leading-tight font-serif text-[#2A3342] mb-4">
              {story.title}
            </h1>

            {/* Tags and Social Icons */}
            <div className="flex flex-wrap gap-3 mb-4">
              {story.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  {tag}
                </span>
              ))}

              {/* Social Icons */}
              <div className="flex gap-2 ml-2">
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Help Text and Button */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-700 text-lg">
                  Let us help you find your best fit university!
                </p>
                <Link to="/universityform">
                  <button className="bg-[#F37021] text-white px-6 py-2 rounded-full hover:bg-[#e85d0a] transition-colors whitespace-nowrap">
                    Find your school
                  </button>
                </Link>
              </div>
              <div className="border-t border-gray-200 mt-4"></div>
            </div>

            
          </div>

          {/* Right side - Image and Sticky Stories2FindSchool */}
          <div className="relative">
            {story.photo && (
              <div className="relative h-[265px]">
                <img
                  src={story.photo.url}
                  alt={story.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
            
          </div>
        </div>

        {/* Content and Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Author and Date */}
            <div className="mt-4 mb-4">
              <div className="text-gray-700">
                By{" "}
                <Link
                  to={`/author/${story.author._id}`}
                  className="text-sm font-medium text-gray-900 hover:text-[#F37021]"
                >
                  {story.author?.name || "Anonymous"}
                </Link>
              </div>
              <div className="text-gray-700">
                Published on{" "}
                {new Date(story.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            <p className="text-xl text-gray-600 mb-6">{story.subtitle}</p>
            <div className="mb-6">
              <Stories1AskAdvisor />
            </div>
            
            <div className="prose max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: story.content }}
                className="story-content"
              />
            </div>

            {/* Author Box */}
            <div 
              onClick={() => navigate(`/author/${story.author._id}`)}
              className="mt-12 p-8 bg-[#1F2937] text-white rounded-xl cursor-pointer hover:bg-opacity-90 transition-colors"
            >
              <div className="text-sm mb-2">Written By</div>
              <h3 className="text-3xl font-serif font-bold mb-4">
                {story.author?.name}
              </h3>
              <p className="text-sm text-gray-300">
                {story.author?.role === 'counselor' && story.author?.counselorInfo?.bio}
                {story.author?.role === 'alumni' && story.author?.alumniInfo?.bio}
                {story.author?.role === 'university' && story.author?.universityInfo?.bio}
              </p>
            </div>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Stories2FindSchool />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StoriesDetail;
