import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const WebChat = ({ roomId, isHost }) => {
  const { messages, sendMessage, joinRoom } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    joinRoom(roomId);
  }, [roomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(roomId, {
        text: newMessage,
        sender: user.name,
        timestamp: new Date().toISOString()
      });
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Live Chat</h3>
        {isHost && (
          <button className="text-sm text-gray-600">
            Manage Chat
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-sm font-medium">{msg.sender}</span>
            <p className="bg-gray-100 rounded-lg p-2 mt-1">{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="border-t pt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full px-4 py-2 border rounded-full"
        />
      </form>
    </div>
  );
};

export default WebChat;