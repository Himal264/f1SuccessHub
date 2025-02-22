import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoriesAdd } from '../context/StoriesAddContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Stories1AskAdvisor from './Stories1AskAdvisor';
import Stories2FindSchool from './Stories2FindSchool';
import Quill from 'quill';

const StoriesAdd = () => {
  const navigate = useNavigate();
  const { createStory, loading, error } = useStoriesAdd();
  const [showPreview, setShowPreview] = useState(false);
  const [advisorPosition, setAdvisorPosition] = useState('default');
  const quillRef = useRef(null);
  const [user] = useState(JSON.parse(localStorage.getItem('userInfo')));
  const [previewUrl, setPreviewUrl] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const storyTypes = ['student', 'university', 'study in usa', 'news'];

  // Predefined tags list
  const predefinedTags = {
    // Universities
    universities: [
      'New York University',
      'Carnegie Mellon University',
      'Harvard University',
      'MIT',
      // ... add more universities
    ],
    // Countries
    countries: [
      'Korea',
      'India',
      'USA',
      'China',
      // ... add more countries
    ],
    // Regions
    regions: [
      'Southeast Asia',
      'North America',
      'Europe',
      // ... add more regions
    ],
    // Majors and Fields
    majors: [
      'Economics',
      'Engineering',
      'Computer Science',
      'Business',
      'Finance',
      // ... add more majors
    ]
  };

  // Initialize form data
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    storyType: '',
    tags: [],
    photo: null,
    author: user?.name || '',
    publishDate: new Date().toISOString().split('T')[0],
  });

  // Define custom table button and handler
  const CustomTable = Quill.import('modules/toolbar');

  // Define modules with working table handling
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['blockquote', 'code-block'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image'],
        ['table']
      ],
      handlers: {
        table: function() {
          const quill = quillRef.current.getEditor();
          if (quill) {
            const range = quill.getSelection();
            const tableHTML = `
              <table class="min-w-full divide-y divide-gray-200 border my-4">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Header 1</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Header 2</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Header 3</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">Cell 1</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">Cell 2</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">Cell 3</td>
                  </tr>
                </tbody>
              </table>
            `;
            quill.clipboard.dangerouslyPasteHTML(range ? range.index : 0, tableHTML);
          }
        }
      }
    }
  }), []);

  // Update formats to include all necessary formats
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'script', 'super', 'sub',
    'indent',
    'size',
    'blockquote',
    'code-block',
    'color', 'background',
    'font',
    'align',
    'clean',
    'link', 'image',
    'table'
  ];

  // Add editor styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .quill-editor {
        display: flex;
        flex-direction: column;
        height: 400px !important;
      }
      .ql-container {
        flex: 1;
        font-size: 16px;
        overflow: auto;
      }
      .ql-editor {
        min-height: 350px;
        padding: 1rem;
        overflow-y: auto;
        font-family: inherit;
      }
      .ql-toolbar {
        position: sticky;
        top: 0;
        z-index: 1;
        background: white;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        border-bottom: 1px solid #e2e8f0;
      }
      .ql-toolbar.ql-snow {
        border: none;
        padding: 0.5rem;
      }
      .ql-container.ql-snow {
        border: none;
      }
      .ql-editor p {
        margin-bottom: 1em;
      }
      .ql-snow .ql-toolbar button {
        height: 24px;
        width: 24px;
        padding: 3px 5px;
      }
      .ql-snow .ql-toolbar button.ql-table::after {
        content: "TABLE";
        font-size: 12px;
      }
      .ql-editor table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
      }
      .ql-editor table td,
      .ql-editor table th {
        border: 1px solid #e2e8f0;
        padding: 0.5rem;
        min-width: 100px;
      }
      .ql-editor table th {
        background-color: #f8fafc;
        font-weight: 600;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Update the handleContentChange function
  const handleContentChange = useCallback((content) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
  }, []);

  // Add this useEffect to handle editor initialization
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.root.setAttribute('spellcheck', 'false');
    }
  }, []);

  // Handlers
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

  // Function to get tag suggestions
  const getTagSuggestions = (input) => {
    if (!input) return [];
    
    const inputLower = input.toLowerCase();
    let suggestions = [];
    
    // Search through all categories
    Object.values(predefinedTags).forEach(category => {
      const matches = category.filter(tag => 
        tag.toLowerCase().includes(inputLower)
      );
      suggestions = [...suggestions, ...matches];
    });
    
    // Remove duplicates and limit to 5 suggestions
    return [...new Set(suggestions)]
      .slice(0, 5)
      .sort((a, b) => {
        // Prioritize tags that start with the input
        const aStartsWith = a.toLowerCase().startsWith(inputLower);
        const bStartsWith = b.toLowerCase().startsWith(inputLower);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return a.localeCompare(b);
      });
  };

  // Handle tag input change
  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);
    const suggestions = getTagSuggestions(value);
    setTagSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  };

  // Handle tag suggestion click
  const handleTagSuggestionClick = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
    setShowSuggestions(false);
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

  // Preview component
  const StoryPreview = () => {
    useEffect(() => {
      const style = document.createElement('style');
      style.textContent = `
        .prose u {
          text-decoration-color: #F37021;
          text-underline-offset: 2px;
        }
        .prose u:hover {
          color: #F37021;
          transition: color 0.3s ease;
        }
        .story-content {
          font-size: 1.125rem; /* 18px */
          line-height: 1.75;
        }
        .story-content p {
          margin-bottom: 1.5rem;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }, []);

    return (
      <div className="bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Title and Image Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {/* Left side - Title and Content */}
            <div>
              <h1 className="text-[52px] leading-tight font-serif text-[#2A3342] mb-4">
                {formData.title}
              </h1>

              {/* Tags and Social Icons */}
              <div className="flex flex-wrap gap-3 mb-4">
                {formData.tags.map((tag, index) => (
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
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
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
                  <button className="bg-[#F37021] text-white px-6 py-2 rounded-full hover:bg-[#e85d0a] transition-colors whitespace-nowrap">
                    Find your school
                  </button>
                </div>
                <div className="border-t border-gray-200 mt-4"></div>
              </div>

              {/* Author and Date */}
              <div className="mt-4 mb-4">
                <div className="text-gray-700">
                  By <span className="text-[#2A3342] font-semibold text-lg">{formData.author}</span>
                </div>
                <div className="text-gray-700">
                  Published on {new Date(formData.publishDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>

              {/* Subtitle */}
              <div className="text-lg text-gray-700 mb-4 leading-relaxed">
                {formData.subtitle}
              </div>
            </div>

            {/* Right side - Image */}
            <div>
              {previewUrl && (
                <div className="relative h-[265px]">
                  <img 
                    src={previewUrl} 
                    alt={formData.title}
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

              <div className="prose max-w-none">
              <div className="w-full mt-4">
                  <Stories1AskAdvisor />
                </div>
                <div dangerouslySetInnerHTML={{ __html: formData.content }} 
                     className="story-content"
                />
               
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
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Create New Story</h2>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          {showPreview ? 'Edit Story' : 'Preview Story'}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className={showPreview ? 'hidden' : 'block'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Story Type</label>
            <select
              name="storyType"
              value={formData.storyType}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-3"
              required
            >
              <option value="">Select a type</option>
              {storyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Featured Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full border rounded-lg p-3"
              required
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="relative">
            <label className="block mb-2 font-medium">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onFocus={() => setShowSuggestions(!!tagInput)}
                onBlur={() => {
                  // Delay hiding suggestions to allow click handling
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                className="flex-1 border rounded-lg p-3"
                placeholder="Add a tag"
              />
              <button
                onClick={() => {
                  if (tagInput && !formData.tags.includes(tagInput)) {
                    handleTagSuggestionClick(tagInput);
                  }
                }}
                type="button"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>

            {/* Tag Suggestions Dropdown */}
            {showSuggestions && tagSuggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1">
                {tagSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    onClick={() => handleTagSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-gray-200 px-3 py-1 rounded-lg flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Content</label>
            <div className="border rounded-lg overflow-hidden">
              <ReactQuill 
                ref={quillRef}
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                theme="snow"
                preserveWhitespace
                bounds=".quill-editor"
                placeholder="Write your story content here..."
                className="quill-editor"
                style={{ 
                  minHeight: '400px'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Creating...' : 'Create Story'}
          </button>
        </form>
      </div>

      {showPreview && <StoryPreview />}
    </div>
  );
};

export default StoriesAdd;
