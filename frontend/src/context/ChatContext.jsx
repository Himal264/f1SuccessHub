import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { backendUrl } from '../App';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return; // Only connect if user is authenticated

    // Create socket with auth
    const newSocket = io(backendUrl, {
      auth: {
        token: localStorage.getItem('token') // Add authentication token
      },
      transports: ['websocket'], // Force WebSocket transport
      reconnection: true, // Enable reconnection
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Socket event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user]);

  const joinRoom = (roomId) => {
    if (socket && roomId) {
      socket.emit('join_room', { roomId, userId: user?._id });
    }
  };

  const sendMessage = (roomId, message) => {
    if (socket && roomId && message) {
      socket.emit('send_message', {
        roomId,
        message,
        sender: user?._id,
        senderName: user?.name,
        timestamp: new Date()
      });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (message) => {
        setMessages(prev => [...prev, message]);
      });
    }
  }, [socket]);

  return (
    <ChatContext.Provider value={{
      socket,
      messages,
      joinRoom,
      sendMessage,
      setMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 