import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FaCalendarAlt, FaMapMarkerAlt, FaUserGraduate } from 'react-icons/fa';
import { backendUrl } from '../App';
import assets from "../assets/assets";
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/event/all`);
      if (response.data.success) {
        setEvents(response.data.events);
      } else {
        throw new Error(response.data.message || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event) => {
    navigate(`/event/${event._id}`);
  };

  // Function to get default profile picture for creator
  const getDefaultProfilePicture = (name) => {
    if (!name) return '';
    const formattedName = encodeURIComponent(name);
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return `https://ui-avatars.com/api/?name=${formattedName}&background=${randomColor}&color=ffffff`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-[#1F2937] text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 py-8">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Upcoming Events
            </h1>
            <p className="text-base text-gray-300">
              Attend an upcoming webinar and discover the many pathways to studying in the US.
            </p>
          </div>

          {/* Right Content - Image */}
          <div className="relative hidden lg:block">
            <img
              src={assets.about} // Replace with your image path
              alt="Student attending online event"
              className="rounded-lg object-cover w-full h-[280px]"
            />
          </div>
        </div>
      </div>

      {/* Events List Header */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">Results: {events.length} events</p>
          <button className="text-[#F37021] hover:underline">University Filters</button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div 
              key={event._id} 
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-115 cursor-pointer p-6"
              onClick={() => handleEventClick(event)}
            >
              {/* Event Type Badge */}
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">
                  {event.type}
                </span>
              </div>

              {/* Event Header with Title and Logo */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-[#1F2937] pr-4">
                  {event.title}
                </h2>
                <img
                  src={event.createdBy?.profilePicture?.url || getDefaultProfilePicture(event.createdBy?.name)}
                  alt={event.createdBy?.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
              </div>

              {/* Education Level Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {event.level?.map((level, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"
                  >
                    {level}
                  </span>
                ))}
              </div>

              {/* Event Date/Time */}
              <div className="text-sm text-gray-600">
                {format(new Date(event.startDate), 'EEEE, MMM d, yyyy')}
                <br />
                {format(new Date(event.startDate), 'hh:mm a')} ({event.language})
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Event;