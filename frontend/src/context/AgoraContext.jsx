import React, { createContext, useContext, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const AgoraContext = createContext();

export const AgoraProvider = ({ children }) => {
  const [rtcClient, setRtcClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);

  const initializeAgora = async (channelName, token, uid) => {
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    await client.join(process.env.VITE_AGORA_APP_ID, channelName, token, uid);
    setRtcClient(client);
    return client;
  };

  const startBroadcast = async () => {
    const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    const videoTrack = await AgoraRTC.createCameraVideoTrack();
    
    setLocalAudioTrack(audioTrack);
    setLocalVideoTrack(videoTrack);
    
    await rtcClient.publish([audioTrack, videoTrack]);
    return { audioTrack, videoTrack };
  };

  const stopBroadcast = async () => {
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    await rtcClient?.leave();
  };

  return (
    <AgoraContext.Provider value={{
      initializeAgora,
      startBroadcast,
      stopBroadcast,
      rtcClient,
      localVideoTrack
    }}>
      {children}
    </AgoraContext.Provider>
  );
};

export const useAgora = () => useContext(AgoraContext); 