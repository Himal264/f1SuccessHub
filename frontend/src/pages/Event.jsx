import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Results: {events.length} events</h1>
            <button 
              className="text-[#F37021] hover:underline"
            >
              University Filters
            </button>
          </div>
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
                {/* Event Type Badge */}
                <div className="mb-2">
                  <span className="text-sm text-[#F37021] font-medium">
                    {event.type}
                  </span>
                </div>

                {/* Event Title */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h2>
                    <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                  </div>
                  {event.universityLogo && (
                    <img 
                      src={event.universityLogo}
                      alt="University logo"
                      className="w-16 h-16 object-contain ml-4"
                    />
                  )}
                </div>

                {/* Categories/Audience Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.categories?.map((category, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                {/* Event Details */}
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  {/* Date and Time */}
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#F37021]" />
                    <div>
                      <div>{format(new Date(event.startDate), 'EEEE, MMM d, yyyy')}</div>
                      <div>{format(new Date(event.startDate), 'hh:mm a')} {event.timezone}</div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#F37021]" />
                    <span>{event.location}</span>
                  </div>
                </div>

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