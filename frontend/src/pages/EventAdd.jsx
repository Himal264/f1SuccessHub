import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaRegClock, FaImage, FaGraduationCap, FaUserTie, FaUniversity } from 'react-icons/fa';
import { RiGraduationCapFill } from 'react-icons/ri';

// EventPreview Component
const EventPreview = ({ formData, userRole }) => {
  const calculateStatus = () => {
    const now = new Date();
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (!formData.startDate || !formData.endDate) return 'upcoming';
    if (end < now) return 'completed';
    if (start <= now && end >= now) return 'ongoing';
    return 'upcoming';
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      {/* Event Header */}
      <div className="flex items-start mb-3">
        <div className="bg-gray-200 rounded-full p-2 mr-3">
          {userRole === 'alumni' ? (
            <FaGraduationCap className="text-2xl text-blue-500" />
          ) : userRole === 'counselor' ? (
            <FaUserTie className="text-2xl text-green-500" />
          ) : userRole === 'university' ? (
            <FaUniversity className="text-2xl text-purple-500" />
          ) : (
            <FaUser className="text-2xl text-gray-500" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{formData.title || 'Event Title'}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              calculateStatus() === 'upcoming' ? 'bg-blue-100 text-blue-800' :
              calculateStatus() === 'ongoing' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {calculateStatus()}
            </span>
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <span>@{userRole || 'organizer'}</span>
            <span>·</span>
            <span>Now</span>
          </div>
        </div>
      </div>

      {/* Event Content */}
      <p className="mb-4 text-gray-800">{formData.description || 'Event description...'}</p>

      {/* Event Details */}
      <div className="border rounded-lg p-3 mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="text-blue-500" />
            <span>
              {formData.startDate ? 
                format(new Date(formData.startDate), 'MMM dd, yyyy h:mm a') : 
                'Start date'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-red-500" />
            <span>{formData.location || 'Location'}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaUsers className="text-purple-500" />
            <span>
              0{formData.maxParticipants ? `/${formData.maxParticipants}` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Image Previews */}
      {formData.images && formData.images.filter(Boolean).length > 0 ? (
        <div className={`grid gap-2 mb-4 ${
          formData.images.filter(Boolean).length === 1 ? 'grid-cols-1' : 'grid-cols-2'
        }`}>
          {formData.images.filter(Boolean).map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`Preview ${index + 1}`}
              className="rounded-lg object-cover h-48 w-full"
            />
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-4 mb-4 text-center text-gray-500">
          <FaImage className="text-3xl mx-auto mb-2" />
          <p>Image preview will appear here</p>
        </div>
      )}

      {/* Categories */}
      {formData.categories && formData.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {formData.categories.map((category, index) => (
            <span key={index} className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {category}
            </span>
          ))}
        </div>
      )}

      {/* Tags */}
      {formData.tags && formData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags.map((tag, index) => (
            <span key={index} className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Event Type */}
      <div className="mt-4">
        <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
          {formData.type || 'event type'}
        </span>
      </div>

      {/* Dates */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaCalendarAlt className="text-blue-500" />
          <span>Starts: {formData.startDate || 'Not set'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaCalendarAlt className="text-red-500" />
          <span>Ends: {formData.endDate || 'Not set'}</span>
        </div>
      </div>
    </div>
  );
};

// Modified EventAdd Component
const EventAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categories: [],
    type: 'in-person',
    startDate: '',
    endDate: '',
    location: '',
    images: new Array(6).fill(null), // Array of 6 null values for images
    tags: [],
    maxParticipants: '',
  });
  const [previewImages, setPreviewImages] = useState(new Array(6).fill(null));
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState(''); // New state for tag input

  // Check for both token and role
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      toast.error('Please login first');
      navigate('/'); // Navigate to home instead of /login
      return;
    }

    // Verify if user has permission to create events
    const allowedRoles = ['admin', 'counselor', 'alumni', 'university'];
    if (!allowedRoles.includes(userRole)) {
      toast.error('You do not have permission to create events');
      navigate('/');
      return;
    }
  }, [navigate]);

  const categories = [
    { id: 'undergraduate', label: 'Undergraduate' },
    { id: 'graduate', label: 'Graduate' },
    { id: 'phd', label: 'PhD' },
    { id: 'research', label: 'Research' },
    { id: 'workshop', label: 'Workshop' },
    { id: 'seminar', label: 'Seminar' }
  ];

  const eventTypes = [
    { id: 'in-person', label: 'In Person' },
    { id: 'online', label: 'Online' },
    { id: 'hybrid', label: 'Hybrid' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle category checkbox changes
  const handleCategoryChange = (categoryId) => {
    setFormData(prev => {
      const updatedCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories: updatedCategories };
    });
  };

  // Handle tag input
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, ''); // Remove # if present
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      setTagInput('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle individual image upload
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData(prev => ({ ...prev, images: newImages }));

      // Update preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...previewImages];
        newPreviews[index] = reader.result;
        setPreviewImages(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages[index] = null;
    setFormData(prev => ({ ...prev, images: newImages }));

    const newPreviews = [...previewImages];
    newPreviews[index] = null;
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');

      if (!token || !userRole) {
        toast.error('Please login first');
        navigate('/');
        return;
      }

      // Construct the appropriate endpoint based on user role
      let endpoint;
      switch(userRole) {
        case 'admin':
          endpoint = `${backendUrl}/api/event/admin/create`;
          break;
        case 'counselor':
          endpoint = `${backendUrl}/api/event/counselor/create`;
          break;
        case 'alumni':
          endpoint = `${backendUrl}/api/event/alumni/create`;
          break;
        case 'university':
          endpoint = `${backendUrl}/api/event/university/create`;
          break;
        default:
          throw new Error('Invalid user role');
      }

      const formPayload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          // Only append non-null images
          formData.images.forEach(image => {
            if (image) {
              formPayload.append('images', image);
            }
          });
        } else if (key === 'categories' || key === 'tags') {
          // Append arrays as JSON strings
          formPayload.append(key, JSON.stringify(formData[key]));
        } else {
          formPayload.append(key, formData[key]);
        }
      });

      const response = await axios.post(endpoint, formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Event created successfully!');
        navigate('/event');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Error creating event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 min-h-[150px]"
              required
            />
          </div>

          {/* Categories as Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(category => (
                <label key={category.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Type tag and press Enter (e.g., event, nepal)"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Individual Image Inputs */}
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Image {index + 1}
                </label>
                <div className="relative">
                  {previewImages[index] ? (
                    <div className="relative">
                      <img
                        src={previewImages[index]}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      onChange={(e) => handleImageChange(e, index)}
                      accept="image/*"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Max Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Participants
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              {eventTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? 'Creating Event...' : 'Create Event'}
          </button>
        </form>
      </div>

      {/* Preview Column */}
      <div className="sticky top-6 h-fit">
        <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
        <EventPreview 
          formData={{
            ...formData,
            images: previewImages.filter(Boolean)
          }}
          userRole={localStorage.getItem('userRole')}
        />
      </div>
    </div>
  );
};

export default EventAdd;