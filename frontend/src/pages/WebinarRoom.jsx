import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAgora } from '../context/AgoraContext';
import WebChat from '../components/WebChat';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-hot-toast';
import { FaVideo, FaMicrophone, FaDesktop, FaVideoSlash, FaMicrophoneSlash } from 'react-icons/fa';

const WebinarRoom = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);

  const { 
    initializeAgora, 
    startBroadcast, 
    stopBroadcast, 
    localVideoTrack,
    localAudioTrack,
    startScreenShare,
    stopScreenShare
  } = useAgora();

  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/event/${id}`);
        if (response.data.success) {
          setEvent(response.data.event);
          
          if (role === 'host' && response.data.event.createdBy._id !== user?._id) {
            navigate(`/webinar/${id}?role=participant`);
          }
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
        toast.error('Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, user, role]);

  const handleStartPreview = async () => {
    try {
      setLoading(true);
      // Initialize Agora with the event ID as channel name
      await initializeAgora(`event_${id}`);
      
      // Start local tracks
      const { audioTrack, videoTrack } = await startBroadcast();
      
      // Play video in the local video element
      if (videoTrack && videoRef.current) {
        videoTrack.play(videoRef.current);
      }
      
      setIsPreview(true);
      toast.success('Camera preview started');
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to start camera. Please check your camera permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartBroadcast = async () => {
    try {
      if (!isPreview) {
        await handleStartPreview();
      }
      // Start actual broadcast here
      setIsStreaming(true);
      toast.success('Broadcasting started successfully!');
    } catch (error) {
      console.error('Broadcasting error:', error);
      toast.error('Failed to start broadcasting');
    }
  };

  const handleStopBroadcast = async () => {
    try {
      await stopBroadcast();
      setIsStreaming(false);
      setIsPreview(false);
      toast.success('Broadcasting ended');
    } catch (error) {
      console.error('Error stopping broadcast:', error);
      toast.error('Failed to stop broadcasting');
    }
  };

  const toggleCamera = async () => {
    try {
      if (localVideoTrack) {
        if (isCameraOn) {
          await localVideoTrack.setEnabled(false);
        } else {
          await localVideoTrack.setEnabled(true);
        }
        setIsCameraOn(!isCameraOn);
      }
    } catch (error) {
      console.error('Error toggling camera:', error);
      toast.error('Failed to toggle camera');
    }
  };

  const toggleMicrophone = async () => {
    try {
      if (localAudioTrack) {
        if (isMicOn) {
          await localAudioTrack.setEnabled(false);
        } else {
          await localAudioTrack.setEnabled(true);
        }
        setIsMicOn(!isMicOn);
      }
    } catch (error) {
      console.error('Error toggling microphone:', error);
      toast.error('Failed to toggle microphone');
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await stopScreenShare();
      } else {
        await startScreenShare();
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error('Error toggling screen share:', error);
      toast.error('Failed to toggle screen sharing');
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
            <div className="bg-black aspect-video rounded-lg relative">
              <div ref={videoRef} className="w-full h-full">
                {role === 'host' && !isPreview && !isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={handleStartPreview}
                      className="bg-[#4B0082] px-6 py-3 rounded-full text-white hover:bg-opacity-90"
                    >
                      Start Camera Preview
                    </button>
                  </div>
                )}
              </div>
              
              {/* Broadcast Controls */}
              {role === 'host' && (isPreview || isStreaming) && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-6 py-3 rounded-full">
                  <div className="flex items-center space-x-6">
                    <button onClick={toggleCamera} className="text-white">
                      {isCameraOn ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
                    </button>
                    <button onClick={toggleMicrophone} className="text-white">
                      {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
                    </button>
                    <button onClick={toggleScreenShare} className="text-white">
                      <FaDesktop size={20} className={isScreenSharing ? "text-blue-400" : ""} />
                    </button>
                    {isPreview && !isStreaming && (
                      <button 
                        onClick={handleStartBroadcast}
                        className="bg-red-500 text-white px-4 py-2 rounded-full"
                      >
                        Go Live
                      </button>
                    )}
                    {isStreaming && (
                      <button 
                        onClick={handleStopBroadcast}
                        className="bg-red-500 text-white px-4 py-2 rounded-full"
                      >
                        End Stream
                      </button>
                    )}
                  </div>
                </div>
              )}
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