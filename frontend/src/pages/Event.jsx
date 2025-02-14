import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FaCalendarAlt, FaMapMarkerAlt, FaUserGraduate } from 'react-icons/fa';
import { backendUrl } from '../App';
import Footer from '../components/Footer';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
    setSelectedEvent(event);
    // You can add navigation or modal logic here
    // For example: navigate(`/event/${event._id}`)
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
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Events ({events.length})</h1>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {events.map((event) => (
            <div 
              key={event._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleEventClick(event)}
            >
              <div className="p-6">
                {/* Event Creator Info */}
                <div className="flex items-center mb-4">
                  <img
                    src={event.createdBy?.profilePicture?.url || getDefaultProfilePicture(event.createdBy?.name)}
                    alt={event.createdBy?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{event.createdBy?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{event.createdBy?.role}</p>
                  </div>
                </div>

                {/* Event Type Badge */}
                <div className="mb-2">
                  <span className="text-sm text-[#F37021] font-medium">
                    {event.type}
                  </span>
                </div>

                {/* Event Title & Description */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h2>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-3">{event.description}</p>
                </div>

                {/* Education Level Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.level?.map((level, index) => (
                    <span 
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"
                    >
                      <FaUserGraduate className="text-[#F37021]" />
                      {level}
                    </span>
                  ))}
                </div>

                {/* Event Details */}
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#F37021]" />
                    <div>
                      {format(new Date(event.startDate), 'EEEE, MMM d, yyyy')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#F37021]" />
                    <span>{event.location}</span>
                  </div>
                </div>

                {/* Participants Info */}
                {event.maxParticipants && (
                  <div className="mt-4 text-sm text-gray-600">
                    <span>Participants: {event.participants?.length || 0}/{event.maxParticipants}</span>
                  </div>
                )}

                {/* Register Button */}
                <div className="mt-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add registration logic here
                    }}
                    className="px-4 py-2 bg-[#F37021] text-white rounded-lg hover:bg-[#e26417] transition-colors text-sm"
                  >
                    Register Now
                  </button>
                </div>
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