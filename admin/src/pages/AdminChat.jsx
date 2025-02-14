import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { IoMdChatboxes } from 'react-icons/io';
import { BsPersonCircle } from 'react-icons/bs';
import { toast } from 'react-toastify';

const AdminChat = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);

  const userTypes = [
    { id: 'all', label: 'All Chats' },
    { id: 'counselor', label: 'Counselors' },
    { id: 'alumni', label: 'Alumni' },
    { id: 'university', label: 'Universities' },
    { id: 'user', label: 'Users' }
  ];

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/chat/list`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setChats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Failed to load chats');
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await axios.post(`${backendUrl}/api/chat/message`, {
        chatId: activeChat._id,
        content: message,
        senderId: activeChat.participants[0].user._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('');
      fetchChatMessages(activeChat._id);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const fetchChatMessages = async (chatId) => {
    try {
      const response = await axios.get(`${backendUrl}/api/chat/${chatId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setActiveChat(prev => ({ ...prev, messages: response.data }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const filteredChats = chats.filter(chat => {
    if (userFilter === 'all') return true;
    return chat.participants.some(p => p.role === userFilter);
  });

  return (
    <div className="flex h-[calc(100vh-100px)]">
      {/* Chat List Sidebar */}
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
          <div className="flex overflow-x-auto mt-4 gap-2">
            {userTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setUserFilter(type.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  userFilter === type.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-y-auto h-full">
          {filteredChats.map(chat => (
            <div
              key={chat._id}
              onClick={() => {
                setActiveChat(chat);
                fetchChatMessages(chat._id);
              }}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                activeChat?._id === chat._id ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {chat.participants[1]?.user?.profilePicture?.url ? (
                  <img
                    src={chat.participants[1].user.profilePicture.url}
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <BsPersonCircle className="w-12 h-12 text-gray-400" />
                )}
                <div>
                  <p className="font-medium">{chat.participants[1]?.user?.name}</p>
                  <p className="text-sm text-gray-500">
                    {chat.participants[1]?.role.charAt(0).toUpperCase() + 
                     chat.participants[1]?.role.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {activeChat ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              {activeChat.participants[1]?.user?.profilePicture?.url ? (
                <img
                  src={activeChat.participants[1].user.profilePicture.url}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <BsPersonCircle className="w-10 h-10 text-gray-400" />
              )}
              <div>
                <p className="font-medium">{activeChat.participants[1]?.user?.name}</p>
                <p className="text-sm text-gray-500">
                  {activeChat.participants[1]?.role.charAt(0).toUpperCase() + 
                   activeChat.participants[1]?.role.slice(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeChat.messages?.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender._id === activeChat.participants[0].user._id
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender._id === activeChat.participants[0].user._id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
};

export default AdminChat;