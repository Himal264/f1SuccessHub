import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { FaCalendarAlt, FaMapMarkerAlt, FaLanguage, FaUsers } from 'react-icons/fa';
import { backendUrl } from '../App';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/event/${id}`);
      if (response.data.success) {
        setEvent(response.data.event);
      } else {
        throw new Error(response.data.message || 'Failed to fetch event details');
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isEventCreator = user && event?.createdBy?._id === user._id;

  const handleWebinarAction = () => {
    if (isEventCreator) {
      navigate(`/webinar/${id}?role=host`);
    } else {
      navigate(`/webinar/${id}?role=participant`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error || 'Event not found'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Breadcrumb */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center text-sm">
            <span 
              onClick={() => navigate('/events')} 
              className="text-gray-600 hover:text-[#F37021] cursor-pointer"
            >
              Events
            </span>
            <span className="mx-2 text-gray-400">{'>'}</span>
            <span className="text-gray-600">{event.type}</span>
          </div>
        </div>
      </div>

      {/* Event Header */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex justify-between items-start">
            {/* Left Content */}
            <div className="flex-1">
              <h1 className="text-4xl font-serif text-[#1F2937] mb-6">
                {event.title}
              </h1>
              
              {/* Education Level Tags */}
              <div className="flex flex-wrap gap-2">
                {event.level?.map((level, index) => (
                  <span 
                    key={index}
                    className="px-4 py-1 bg-white border border-gray-200 text-gray-700 rounded-full text-sm"
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Content - University Logo */}
            <div className="ml-8">
              <img
                src={event.createdBy?.profilePicture?.url}
                alt={event.createdBy?.name}
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Event Time and Description Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Combined Event Time and Description Section */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          {/* Timezone and Event Time */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 uppercase mb-2">MY TIMEZONE</h3>
              <select 
                className="w-80 px-4 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:border-purple-500"
                defaultValue="Eastern Time"
              >
                <option value="Eastern Time">Eastern Time</option>
                {/* Add other timezone options */}
              </select>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 uppercase mb-2">My Event</h3>
              <div className="flex items-center gap-4">
                <div className="w-80 px-4 py-2 border border-gray-300 rounded-full text-gray-700">
                  {format(new Date(event.startDate), 'EEEE MMM d, yyyy \'at\' h:mm a')} - Eastern Time
                </div>
                <button 
                  onClick={handleWebinarAction}
                  className="bg-[#4B0082] text-white px-8 py-2 rounded-full hover:bg-opacity-90 transition-colors"
                >
                  {isEventCreator ? 'Host' : 'Join'}
                </button>
              </div>
            </div>
          </div>
          <p className="text-gray-700 font-medium mb-6">
            {format(new Date(event.startDate), 'EEEE MMM d, yyyy \'at\' h:mm a')} - Eastern Time
          </p>

          {/* Description */}
          <div className="space-y-6">
            <p className="text-gray-700 italic">
              This webinar is exclusively for agents, counselors, and channel partners in North Asia (including Taiwan, South Korea, Japan, and Mongolia) and Southeast Asia.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              Louisiana State University is a top 100 public university with a dedicated focus on student involvement, research opportunities, and experiential learning. Join Marina Pereira, our Managing Director at LSU Global, to learn more about what makes this university so special, including outstanding academics, life on campus, four-year scholarship opportunities, and much more. Bring your questions for our Q&A. GEAUX TIGERS!
            </p>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default EventDetails; 