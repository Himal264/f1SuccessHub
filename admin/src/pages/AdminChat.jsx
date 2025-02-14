import React, { useState, useEffect, useRef } from 'react';
import { IoClose, IoChatboxOutline, IoSend } from 'react-icons/io5';
import { BsPersonCircle } from 'react-icons/bs';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

const AdminChat = ({ onClose }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [chatType, setChatType] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const newSocket = io(backendUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on('new_message', async (data) => {
      if (activeChat && activeChat._id === data.chatId) {
        fetchChatMessages(data.chatId);
      }
      fetchChats();
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/chat/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Failed to load chats');
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async (type) => {
    try {
      const response = await axios.get(`${backendUrl}/api/chat/available-users?type=${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableUsers(response.data);
    } catch (error) {
      console.error('Error fetching available users:', error);
      toast.error('Failed to load available users');
    }
  };

  const startNewChat = async (selectedUserId, userDetails) => {
    try {
      const response = await axios.post(`${backendUrl}/api/chat/create`, {
        participants: [
          { user: localStorage.getItem('userId'), role: 'admin' },
          { user: selectedUserId, role: chatType }
        ]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newChat = response.data;
      newChat.selectedUserDetails = userDetails;
      setChats([...chats, newChat]);
      setActiveChat(newChat);
      setChatType(null);
      setAvailableUsers([]);
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Failed to create chat');
    }
  };

  const fetchChatMessages = async (chatId) => {
    try {
      const response = await axios.get(`${backendUrl}/api/chat/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveChat(prev => ({ ...prev, messages: response.data }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    try {
      await axios.post(`${backendUrl}/api/chat/message`, {
        chatId: activeChat._id,
        content: message,
        senderId: localStorage.getItem('userId')
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      socket.emit('new_message', {
        chatId: activeChat._id,
        message: {
          content: message,
          timestamp: new Date()
        }
      });

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const renderChatTypeSelection = () => (
    <div className="p-4 space-y-4">
      <h3 className="font-medium text-lg">Start a new chat with:</h3>
      <div className="grid grid-cols-1 gap-3">
        <div 
          className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => {
            setChatType('counselor');
            fetchAvailableUsers('counselor');
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <IoChatboxOutline className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Chat with Counselor</h4>
              <p className="text-sm text-gray-500">Connect with counselors</p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => {
            setChatType('alumni');
            fetchAvailableUsers('alumni');
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <IoChatboxOutline className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Chat with Alumni</h4>
              <p className="text-sm text-gray-500">Connect with alumni</p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => {
            setChatType('university');
            fetchAvailableUsers('university');
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <IoChatboxOutline className="text-purple-600 w-6 h-6" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Chat with University</h4>
              <p className="text-sm text-gray-500">Connect with universities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAvailableUsers = () => (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">
          Available {chatType.charAt(0).toUpperCase() + chatType.slice(1)}s
        </h3>
        <button
          onClick={() => {
            setChatType(null);
            setAvailableUsers([]);
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          Back
        </button>
      </div>
      <div className="divide-y">
        {availableUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => startNewChat(user._id, user)}
            className="p-4 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              {user.profilePicture?.url ? (
                <img
                  src={user.profilePicture.url}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <BsPersonCircle className="w-12 h-12 text-gray-400" />
              )}
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-white rounded-lg shadow-xl flex flex-col">
      <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0">
        <h3 className="font-medium text-lg">Messages</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <IoClose size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F37021]"></div>
          </div>
        ) : activeChat ? (
          <div className="flex flex-col h-full">
            <div className="p-3 border-b bg-white">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveChat(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoClose size={24} />
                </button>
                {activeChat.participants[1]?.user?.profilePicture?.url ? (
                  <img
                    src={activeChat.participants[1].user.profilePicture.url}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <BsPersonCircle className="w-10 h-10 text-gray-400" />
                )}
                <div>
                  <p className="font-medium">{activeChat.participants[1]?.user?.name}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {activeChat.participants[1]?.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeChat.messages?.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === localStorage.getItem('userId')
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sender === localStorage.getItem('userId')
                        ? 'bg-[#F37021] text-white'
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
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-3 border-t bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                />
                <button
                  type="submit"
                  className="p-2 bg-[#F37021] text-white rounded-full hover:bg-[#e85d0a]"
                >
                  <IoSend size={20} />
                </button>
              </div>
            </form>
          </div>
        ) : chatType && availableUsers.length > 0 ? (
          renderAvailableUsers()
        ) : (
          <div>
            {renderChatTypeSelection()}
            <div className="p-4 border-t">
              <h3 className="font-medium text-lg mb-4">Recent Chats</h3>
              <div className="divide-y">
                {chats.map(chat => (
                  <div
                    key={chat._id}
                    onClick={() => {
                      setActiveChat(chat);
                      fetchChatMessages(chat._id);
                    }}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      {chat.participants[1]?.user?.profilePicture?.url ? (
                        <img
                          src={chat.participants[1].user.profilePicture.url}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <BsPersonCircle className="w-12 h-12 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium">{chat.participants[1]?.user?.name}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {chat.participants[1]?.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;