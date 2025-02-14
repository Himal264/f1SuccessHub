import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { backendUrl } from '../App';

const WebinarRoom = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/event/${id}`);
        if (response.data.success) {
          setEvent(response.data.event);
          
          // Verify if user has permission to host
          if (role === 'host' && response.data.event.createdBy._id !== user?._id) {
            navigate(`/webinar/${id}?role=participant`);
          }
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, user, role]);

  if (loading) {
    return <div>Loading webinar room...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to join the webinar</h2>
          <button 
            onClick={() => navigate('/loginform')}
            className="bg-[#4B0082] text-white px-6 py-2 rounded-full"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Webinar Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">{event?.title}</h1>
            <div className="flex items-center gap-4">
              <span className="text-red-500">LIVE</span>
              {role === 'host' && (
                <button 
                  className="bg-red-500 text-white px-4 py-1 rounded-full text-sm"
                >
                  End Stream
                </button>
              )}
              <button 
                onClick={() => navigate(`/event/${id}`)}
                className="text-gray-600 hover:text-gray-900"
              >
                {role === 'host' ? 'End Webinar' : 'Exit Webinar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Webinar Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Area */}
          <div className="lg:col-span-2">
            <div className="bg-black aspect-video rounded-lg flex items-center justify-center">
              {role === 'host' ? (
                <div className="text-white text-center">
                  <p className="mb-2">Host Controls</p>
                  <button className="bg-[#4B0082] px-4 py-2 rounded-full">
                    Start Broadcasting
                  </button>
                </div>
              ) : (
                <p className="text-white">Waiting for host to start the stream...</p>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-white rounded-lg p-4 h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Live Chat</h3>
              {role === 'host' && (
                <button className="text-sm text-gray-600">
                  Manage Chat
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto mb-4">
              {/* Chat messages will appear here */}
            </div>
            <div className="border-t pt-4">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full px-4 py-2 border rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebinarRoom; 