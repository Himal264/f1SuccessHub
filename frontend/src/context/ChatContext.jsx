import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { backendUrl } from '../App';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('join_room', roomId);
    }
  };

  const sendMessage = (roomId, message) => {
    if (socket) {
      socket.emit('send_message', { roomId, message });
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

export const useChat = () => useContext(ChatContext); 