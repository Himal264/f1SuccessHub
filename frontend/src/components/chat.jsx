import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { IoMdChatboxes } from 'react-icons/io';
import { IoClose, IoSend } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [hasApplication, setHasApplication] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChatIconClick = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/login');
      return;
    }

    // Only check application status and fetch chats if user is authenticated
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/applications/check/${user._id}`);
      const data = await response.json();
      setHasApplication(data.hasApplication);
      
      if (data.hasApplication) {
        setIsOpen(true);
        fetchChats();
      } else {
        alert('Please submit an application before starting a chat.');
      }
    } catch (error) {
      console.error('Error checking application:', error);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/list?userId=${user._id}&role=${user.role}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: activeChat._id,
          senderId: user._id,
          content: message,
        }),
      });

      const updatedChat = await response.json();
      setChats(chats.map(chat => 
        chat._id === updatedChat._id ? updatedChat : chat
      ));
      setActiveChat(updatedChat);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!user || (user.role === 'user' && !hasApplication)) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          onClick={handleChatIconClick}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg"
        >
          <IoMdChatboxes size={24} />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-[350px] h-[500px] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold">Messages</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Chat List / Messages */}
          <div className="flex-1 overflow-y-auto">
            {!activeChat ? (
              // Chat List
              <div className="divide-y">
                {chats.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => setActiveChat(chat)}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.role === 'counselor' 
                          ? chat.user.profilePicture.url 
                          : chat.counselor.profilePicture.url}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">
                          {user.role === 'counselor' 
                            ? chat.user.name 
                            : chat.counselor.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {chat.messages[chat.messages.length - 1]?.content.substring(0, 30)}...
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Messages View
              <div className="p-4 space-y-4">
                {activeChat.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sender === user._id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          {activeChat && (
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                >
                  <IoSend size={20} />
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
