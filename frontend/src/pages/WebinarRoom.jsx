import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAgora } from '../context/AgoraContext';
import WebChat from '../components/WebChat';
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

  const { initializeAgora, startBroadcast, stopBroadcast, localVideoTrack } = useAgora();
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);

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

  const handleStartBroadcast = async () => {
    try {
      await initializeAgora(id, null, user._id);
      await startBroadcast();
      setIsStreaming(true);
      
      if (localVideoTrack && videoRef.current) {
        localVideoTrack.play(videoRef.current);
      }
    } catch (error) {
      console.error('Error starting broadcast:', error);
    }
  };

  const handleStopBroadcast = async () => {
    try {
      await stopBroadcast();
      setIsStreaming(false);
    } catch (error) {
      console.error('Error stopping broadcast:', error);
    }
  };

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
              <div ref={videoRef} className="w-full h-full">
                {role === 'host' ? (
                  !isStreaming ? (
                    <div className="text-white text-center">
                      <p className="mb-2">Host Controls</p>
                      <button 
                        onClick={handleStartBroadcast}
                        className="bg-[#4B0082] px-4 py-2 rounded-full"
                      >
                        Start Broadcasting
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleStopBroadcast}
                      className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full"
                    >
                      Stop Broadcasting
                    </button>
                  )
                ) : (
                  <p className="text-white">
                    {isStreaming ? "Connecting to stream..." : "Waiting for host to start the stream..."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-white rounded-lg p-4 h-[600px]">
            <WebChat roomId={id} isHost={role === 'host'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebinarRoom; 