import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow, format } from 'date-fns';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTag } from 'react-icons/fa';
import { RiGraduationCapFill } from 'react-icons/ri';
import { backendUrl } from '../App';
import assets from '../assets/assets';
import StickyAdvisorNote from '../components/StickyAdvisorNote';
import SuccessMatters from '../components/SuccessMatters';
import Footer from '../components/Footer';

// Custom EventHero Component
const EventHero = () => {
  return (
    <div className="relative bg-[#2A374C] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row items-center gap-8">
        {/* Text Content */}
        <div className="flex-1 z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            Attend an upcoming webinar and discover the many pathways to studying in the US.
          </p>
        </div>
        
        {/* Image */}
        <div className="flex-1 relative">
          <img
            src={assets.hero} // Make sure this image exists in your public folder
            alt="Student attending webinar"
            className="rounded-lg shadow-xl w-full max-w-md mx-auto"
          />

        </div>

        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A374C] to-transparent opacity-90"></div>
      </div>
    </div>
  );
};

const EventCard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/event/all`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

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
    fetchEvents();
  }, []);

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
    <>
      <EventHero />
      <div className="relative flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 pb-20 lg:pb-4">
        {/* Main Content */}
        <div className="flex-1">
          {/* Events List */}
          <div className="space-y-6">
            {events.length === 0 ? (
              <div className="text-center py-8 text-gray-600 bg-white rounded-xl shadow-lg">
                No events found
              </div>
            ) : (
              events.map((event) => (
                <div key={event._id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  {/* Event Header */}
                  <div className="flex items-start mb-4">
                    <div className="bg-gray-100 rounded-full p-3 mr-4">
                      <RiGraduationCapFill className="text-3xl text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Created by {event.creatorRole} • {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>

                  {/* Event Description */}
                  <p className="text-gray-700 mb-6">{event.description}</p>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      {/* Date and Time */}
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-500" />
                        <div>
                          <div className="text-sm font-medium">
                            Start: {format(new Date(event.startDate), 'PPP p')}
                          </div>
                          <div className="text-sm font-medium">
                            End: {format(new Date(event.endDate), 'PPP p')}
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span>{event.location}</span>
                      </div>

                      {/* Participants */}
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-purple-500" />
                        <span>
                          {event.participants?.length || 0} / {event.maxParticipants} participants
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Event Type */}
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                          {event.type}
                        </span>
                      </div>

                      {/* Categories */}
                      {event.categories && event.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {event.categories.map((category, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {category}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {event.tags.map((tag, index) => (
                            <span key={index} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                              <FaTag className="text-gray-500" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Event Images */}
                  {event.images && event.images.length > 0 && (
                    <div className={`grid gap-4 mb-6 ${
                      event.images.length === 1 ? 'grid-cols-1' : 
                      event.images.length === 2 ? 'grid-cols-2' :
                      'grid-cols-3'
                    }`}>
                      {event.images.map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={`Event ${index + 1}`}
                          className="rounded-lg object-cover w-full h-48"
                        />
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-6">
                    <button className="px-4 py-2 bg-[#F37021] hover:bg-[#e26417] text-white rounded-lg transition-colors">
                      Register Now
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                      Share Event
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sticky Advisor Note */}
        <StickyAdvisorNote />
      </div>

      {/* Success Matters and Footer */}
      <div className="mt-6">
        <SuccessMatters />
        <Footer />
      </div>
    </>
  );
};

export default EventCard;