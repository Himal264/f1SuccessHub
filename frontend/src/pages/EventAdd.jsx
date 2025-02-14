import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaRegClock, FaImage, FaGraduationCap, FaUserTie, FaUniversity } from 'react-icons/fa';
import { RiGraduationCapFill } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa';

// Internal Preview Component
const EventPreviewCard = ({ formData, userRole }) => {
  // Get creator's initials for the profile display
  const getInitials = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    const name = userInfo.name || '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get creator's profile picture
  const getCreatorProfile = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    return userInfo.profilePicture?.url;
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      {/* Header with Logo */}
      <div className="bg-[#0B1F51] p-6 flex justify-between items-center">
        <h1 className="text-2xl text-white font-serif">{formData.title || 'Event Title'}</h1>
        <div className="w-16 h-16 bg-white p-2 rounded-lg overflow-hidden">
          {getCreatorProfile() ? (
            <img 
              src={getCreatorProfile()} 
              alt="Creator"
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#0B1F51] font-bold text-xl">
              {getInitials()}
            </div>
          )}
        </div>
      </div>

      {/* Education Level Tags */}
      <div className="px-6 py-4 flex gap-2">
        {formData.level && formData.level.map((level, index) => (
          <span
            key={index}
            className="inline-block px-4 py-1 rounded-full border border-gray-300 text-sm font-medium"
          >
            {level}
          </span>
        ))}
      </div>

      {/* Event Details */}
      <div className="px-6 py-4">
        <div className="space-y-4">
          {/* Time and Location Section */}
          <div className="space-y-2">
            <div className="flex items-center text-gray-700">
              <span className="font-medium">MY TIMEZONE</span>
            </div>
            <div className="flex items-center space-x-4">
              <select className="border rounded-md px-3 py-2 text-sm w-48">
                <option>Eastern Time</option>
                {/* Add other timezone options */}
              </select>
            </div>
            
            <div className="flex items-center text-gray-700 mt-4">
              <span className="font-medium">My Event</span>
            </div>
            <div className="bg-gray-50 rounded-md p-3 text-sm">
              {formData.startDate ? 
                format(new Date(formData.startDate), 'EEEE MMM d, yyyy \'at\' h:mm a') + ' - Eastern Time'
                : 'Select date and time'
              }
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 text-gray-600">
            <p className="whitespace-pre-wrap">{formData.description || 'This event description will appear here...'}</p>
          </div>

          {/* Register Button */}
          <button className="w-full bg-black text-white py-3 px-6 rounded-md font-medium hover:bg-gray-900 transition-colors">
            Register
          </button>
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
    level: [], // Array for education levels
    language: '', // Added language field
    type: 'physical', // Changed default to match model
    startDate: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Check for both token and role
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      toast.error('Please login first');
      navigate('/');
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

  const levels = [
    { id: 'undergraduate', label: 'Undergraduate' },
    { id: 'graduate', label: 'Graduate' },
    { id: 'master', label: 'Master' },
    { id: 'phd', label: 'PhD' },
    { id: 'language', label: 'Language' }
  ];

  const eventTypes = [
    { id: 'physical', label: 'Physical' },
    { id: 'webinar', label: 'Webinar' },
    { id: 'hybrid', label: 'Hybrid' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLevelChange = (levelId) => {
    setFormData(prev => {
      const updatedLevels = prev.level.includes(levelId)
        ? prev.level.filter(id => id !== levelId)
        : [...prev.level, levelId];
      return { ...prev, level: updatedLevels };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/event/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Event created successfully!');
        navigate('/event');
      } else {
        throw new Error(data.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.message || 'Error creating event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
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
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Education Levels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education Levels
            </label>
            <div className="space-y-2">
              {levels.map(level => (
                <label key={level.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.level.includes(level.id)}
                    onChange={() => handleLevelChange(level.id)}
                    className="rounded text-blue-500 mr-2"
                  />
                  {level.label}
                </label>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
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

          {/* Start Date & Time */}
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
              required={formData.type === 'physical' || formData.type === 'hybrid'}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-[#F37021] text-white rounded-md hover:bg-[#e26417] disabled:bg-gray-400"
          >
            {isLoading ? 'Creating Event...' : 'Create Event'}
          </button>
        </form>
      </div>

      {/* Preview Column */}
      <div className="sticky top-6 h-fit">
        <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
        <EventPreviewCard 
          formData={formData}
          userRole={localStorage.getItem('userRole')}
        />
      </div>
    </div>
  );
};

export default EventAdd;