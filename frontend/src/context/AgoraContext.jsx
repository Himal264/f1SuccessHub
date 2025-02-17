import React, { createContext, useContext, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import axios from 'axios';
import { backendUrl } from '../App';

const AgoraContext = createContext();

export const AgoraProvider = ({ children }) => {
  const [rtcClient, setRtcClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [screenTrack, setScreenTrack] = useState(null);

  // Initialize Agora client
  const initializeAgora = async (channelName) => {
    try {
      // Get token from backend
      const response = await axios.post(`${backendUrl}/api/webinar/token`, {
        channelName
      });

      const { token, uid } = response.data;

      // Create Agora client
      const client = AgoraRTC.createClient({ 
        mode: 'rtc', 
        codec: 'vp8'
      });

      // Join channel
      await client.join(
        import.meta.env.VITE_AGORA_APP_ID,
        channelName,
        token,
        uid
      );

      setRtcClient(client);
      return client;
    } catch (error) {
      console.error('Error initializing Agora:', error);
      throw error;
    }
  };

  // Start broadcasting
  const startBroadcast = async () => {
    try {
      // Request camera and microphone permissions
      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack({
          encoderConfig: {
            sampleRate: 48000,
            stereo: true,
            bitrate: 128
          }
        }),
        AgoraRTC.createCameraVideoTrack({
          encoderConfig: {
            width: 1280,
            height: 720,
            frameRate: 30,
            bitrateMin: 600,
            bitrateMax: 2000
          }
        })
      ]);

      // Set local tracks
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      // Publish tracks if client exists
      if (rtcClient) {
        await rtcClient.publish([audioTrack, videoTrack]);
      }

      return { audioTrack, videoTrack };
    } catch (error) {
      console.error('Error starting broadcast:', error);
      throw error;
    }
  };

  // Stop broadcasting
  const stopBroadcast = async () => {
    try {
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }
      if (rtcClient) {
        await rtcClient.unpublish();
        await rtcClient.leave();
      }

      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
      setRtcClient(null);
    } catch (error) {
      console.error('Error stopping broadcast:', error);
      throw error;
    }
  };

  // Screen sharing
  const startScreenShare = async () => {
    try {
      const screenVideoTrack = await AgoraRTC.createScreenVideoTrack({
        encoderConfig: {
          width: 1920,
          height: 1080,
          frameRate: 30,
          bitrateMin: 600,
          bitrateMax: 2000
        }
      });

      if (rtcClient) {
        if (localVideoTrack) {
          await rtcClient.unpublish(localVideoTrack);
        }
        await rtcClient.publish(screenVideoTrack);
      }

      setScreenTrack(screenVideoTrack);
      return screenVideoTrack;
    } catch (error) {
      console.error('Error starting screen share:', error);
      throw error;
    }
  };

  const stopScreenShare = async () => {
    try {
      if (screenTrack) {
        screenTrack.stop();
        screenTrack.close();
        if (rtcClient) {
          await rtcClient.unpublish(screenTrack);
          if (localVideoTrack) {
            await rtcClient.publish(localVideoTrack);
          }
        }
        setScreenTrack(null);
      }
    } catch (error) {
      console.error('Error stopping screen share:', error);
      throw error;
    }
  };

  return (
    <AgoraContext.Provider value={{
      initializeAgora,
      startBroadcast,
      stopBroadcast,
      rtcClient,
      localVideoTrack,
      localAudioTrack,
      startScreenShare,
      stopScreenShare,
      screenTrack
    }}>
      {children}
    </AgoraContext.Provider>
  );
};

export const useAgora = () => {
  const context = useContext(AgoraContext);
  if (!context) {
    throw new Error('useAgora must be used within an AgoraProvider');
  }
  return context;
}; 