import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { IoMdChatboxes } from 'react-icons/io';
import { IoClose, IoSend } from 'react-icons/io5';
import { BsPersonCircle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const Chat = ({ isOpen, onClose, user }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [chatType, setChatType] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const userTypes = [
    { id: 'all', label: 'All Chats' },
    { id: 'counselor', label: 'Counselors' },
    { id: 'alumni', label: 'Alumni' },
    { id: 'university', label: 'Universities' },
    { id: 'user', label: 'Users' }
  ];

  const [chats, setChats] = useState([]);

  const filteredChats = chats.filter(chat => {
    if (selectedUserType === 'all') return true;
    return chat.participants.some(p => 
      p.user._id !== authUser._id && p.role === selectedUserType
    );
  });

  const handleChatIconClick = () => {
    if (!authUser) {
      navigate('/login');
      return;
    }
    setChatType(null);
    setAvailableUsers([]);
    fetchChats();
  };

  const fetchChats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/list?userId=${authUser._id}`,
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

  const fetchAvailableUsers = async (type) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/available-users?type=${type}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setAvailableUsers(data);
    } catch (error) {
      console.error('Error fetching available users:', error);
    }
  };

  const startNewChat = async (selectedUserId, userDetails) => {
    try {
      setSelectedUser(userDetails);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            participantId: selectedUserId
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create chat');
      }

      const data = await response.json();
      
      if (data && data.participants) {
        setChats(prevChats => [...prevChats, data]);
        setActiveChat(data);
        setChatType(null);
        setAvailableUsers([]);
      } else {
        throw new Error('Invalid chat data received');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const fetchChatMessages = async (chatId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/${chatId}/messages?userId=${authUser._id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  };

  const handleSetActiveChat = async (chat) => {
    try {
      const messages = await fetchChatMessages(chat._id);
      setActiveChat({
        ...chat,
        messages: messages
      });
    } catch (error) {
      console.error('Error setting active chat:', error);
    }
  };

  const renderChatTypeSelection = () => {
    if (authUser.role === 'counselor' || authUser.role === 'alumni' || authUser.role === 'university') {
      return (
        <div className="p-4">
          <p className="text-gray-500">You can view and respond to chats from your messages.</p>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4">
        <h3 className="font-medium text-lg">Start a new chat with:</h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => {
              setChatType('counselor');
              fetchAvailableUsers('counselor');
            }}>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <IoMdChatboxes className="text-blue-600 w-6 h-6" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Chat with Counselor</h4>
                <p className="text-sm text-gray-500">Get professional guidance and advice</p>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => {
              setChatType('alumni');
              fetchAvailableUsers('alumni');
            }}>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <IoMdChatboxes className="text-green-600 w-6 h-6" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Chat with Alumni</h4>
                <p className="text-sm text-gray-500">Connect with experienced graduates</p>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => {
              setChatType('university');
              fetchAvailableUsers('university');
            }}>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <IoMdChatboxes className="text-purple-600 w-6 h-6" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Chat with University</h4>
                <p className="text-sm text-gray-500">Discuss with university representatives</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        {availableUsers.map((availableUser) => (
          <div
            key={availableUser._id}
            onClick={() => startNewChat(availableUser._id, availableUser)}
            className="p-4 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              {availableUser.profilePicture?.url ? (
                <img
                  src={availableUser.profilePicture.url}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <BsPersonCircle className="w-12 h-12 text-gray-400" />
              )}
              <div className="flex-1">
                <p className="font-medium">{availableUser.name}</p>
                {chatType === 'counselor' && (
                  <div className="text-sm text-gray-500">
                    <p>Professional Counselor</p>
                    <p>{availableUser.specialization || 'Career Guidance'}</p>
                    <p>{availableUser.experience || '5+ years experience'}</p>
                  </div>
                )}
                {chatType === 'alumni' && (
                  <div className="text-sm text-gray-500">
                    <p>Alumni Member</p>
                    <p>{availableUser.university || 'University Graduate'}</p>
                    <p>{availableUser.graduationYear || 'Class of 2022'}</p>
                  </div>
                )}
                {chatType === 'university' && (
                  <div className="text-sm text-gray-500">
                    <p>University Representative</p>
                    <p>{availableUser.universityName || 'University Admin'}</p>
                    <p>{availableUser.department || 'Admissions Department'}</p>
                  </div>
                )}
                <div className="mt-1 flex items-center text-sm">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    availableUser.online ? 'bg-green-500' : 'bg-gray-400'
                  }`}></span>
                  <span className="text-gray-500">
                    {availableUser.online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUserTypeTabs = () => (
    <div className="flex overflow-x-auto border-b bg-white sticky top-0 z-10">
      {userTypes.map(type => (
        <button
          key={type.id}
          onClick={() => setSelectedUserType(type.id)}
          className={`px-4 py-2 whitespace-nowrap ${
            selectedUserType === type.id
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {type.label}
        </button>
      ))}
    </div>
  );

  const renderChatList = () => (
    <div className="flex flex-col h-full">
      {renderUserTypeTabs()}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y">
          {filteredChats.map((chat) => {
            const otherParticipant = chat.participants.find(
              p => p.user._id !== authUser._id
            );
            const lastMessage = chat.messages[chat.messages.length - 1];

            return (
              <div
                key={chat._id}
                onClick={() => handleSetActiveChat(chat)}
                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <div className="relative">
                  {otherParticipant.user.profilePicture?.url ? (
                    <img
                      src={otherParticipant.user.profilePicture.url}
                      alt="Profile"
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <BsPersonCircle className="w-12 h-12 text-gray-400" />
                  )}
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                    otherParticipant.user.online ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-gray-900">
                      {otherParticipant.user.name}
                    </h3>
                    {lastMessage && (
                      <span className="text-xs text-gray-500">
                        {new Date(lastMessage.timestamp).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 capitalize">
                      {otherParticipant.role}
                    </span>
                    {lastMessage && (
                      <p className="text-sm text-gray-500 truncate ml-2">
                        • {lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {authUser.role === 'user' && (
        <div className="p-3 border-t">
          <button
            onClick={() => setChatType('select')}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center"
          >
            <IoMdChatboxes className="mr-2" />
            Start New Chat
          </button>
        </div>
      )}
    </div>
  );

  const renderMessage = (msg, index) => {
    const isCurrentUser = msg.sender === authUser._id;
    const otherParticipant = activeChat.participants.find(
      p => p.user._id !== authUser._id
    ).user;
    
    return (
      <div
        key={index}
        className={`flex items-end space-x-2 mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        {!isCurrentUser && (
          <div className="flex-shrink-0">
            {otherParticipant.profilePicture?.url ? (
              <img
                src={otherParticipant.profilePicture.url}
                alt={otherParticipant.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <BsPersonCircle className="w-8 h-8 text-gray-400" />
            )}
          </div>
        )}

        <div
          className={`max-w-[70%] p-3 rounded-lg ${
            isCurrentUser
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-100 rounded-bl-none'
          }`}
        >
          {!isCurrentUser && (
            <div className="text-xs text-gray-500 mb-1">
              {otherParticipant.name}
            </div>
          )}
          {msg.content}
          <div className="text-xs mt-1 opacity-70 flex justify-between items-center">
            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            {isCurrentUser && (
              <span className="ml-2">
                {msg.read ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>

        {isCurrentUser && (
          <div className="flex-shrink-0">
            {authUser.profilePicture?.url ? (
              <img
                src={authUser.profilePicture.url}
                alt="Your profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <BsPersonCircle className="w-8 h-8 text-gray-400" />
            )}
          </div>
        )}
      </div>
    );
  };

  const renderActiveChat = () => {
    if (!activeChat || !activeChat.participants) {
      return <div>Loading chat...</div>;
    }

    const otherParticipant = activeChat.participants.find(
      p => p.user._id !== authUser._id
    );

    if (!otherParticipant || !otherParticipant.user) {
      return <div>Error loading chat participant</div>;
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center p-3 border-b bg-white">
          <button
            onClick={() => {
              setActiveChat(null);
              setSelectedUser(null);
            }}
            className="mr-2 text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
          <div className="flex items-center flex-1">
            <div className="relative">
              {otherParticipant.user.profilePicture?.url ? (
                <img
                  src={otherParticipant.user.profilePicture.url}
                  alt={otherParticipant.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <BsPersonCircle className="w-10 h-10 text-gray-400" />
              )}
              <span 
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                  otherParticipant.user.online ? 'bg-green-500' : 'bg-gray-300'
                } border-2 border-white`}
              />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="font-medium text-gray-900">
                {otherParticipant.user.name}
              </h3>
              {otherParticipant.user.role === 'university' && (
                <div className="text-sm text-gray-500">
                  <p>University Representative</p>
                  <p>{otherParticipant.user.universityName || 'University Admin'}</p>
                  <p>{otherParticipant.user.department || 'Admissions Department'}</p>
                </div>
              )}
              {otherParticipant.user.role === 'counselor' && (
                <div className="text-sm text-gray-500">
                  <p>Professional Counselor</p>
                  <p>{otherParticipant.user.specialization || 'Career Guidance'}</p>
                  <p>{otherParticipant.user.experience || '5+ years experience'}</p>
                </div>
              )}
              {otherParticipant.user.role === 'alumni' && (
                <div className="text-sm text-gray-500">
                  <p>Alumni Member</p>
                  <p>{otherParticipant.user.university || 'University Graduate'}</p>
                  <p>{otherParticipant.user.graduationYear || 'Class of 2022'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeChat.messages.map((msg, index) => renderMessage(msg, index))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-3 border-t bg-white">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
              disabled={!message.trim()}
            >
              <IoSend size={20} />
            </button>
          </div>
        </form>
      </div>
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat]);

  useEffect(() => {
    if (!socket && user) {
      const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
        auth: { token: localStorage.getItem('token') }
      });

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
      });

      newSocket.on('new_message', (data) => {
        setMessages(prev => [...prev, data.message]);
        scrollToBottom();
      });

      newSocket.on('user_typing', ({ userId, isTyping }) => {
        if (userId !== user._id) {
          setIsTyping(isTyping);
        }
      });

      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [user]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    if (socket) {
      socket.emit('typing', {
        chatId: activeChat._id,
        isTyping: true
      });

      if (typingTimeout) clearTimeout(typingTimeout);
      
      const timeout = setTimeout(() => {
        socket.emit('typing', {
          chatId: activeChat._id,
          isTyping: false
        });
      }, 1000);

      setTypingTimeout(timeout);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          chatId: activeChat._id,
          content: message
        })
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages(prev => [...prev, newMessage]);
        setMessage('');
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .typing-indicator {
        display: flex;
        gap: 4px;
      }
      .typing-indicator span {
        width: 8px;
        height: 8px;
        background: #90909090;
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out;
      }
      .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
      .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!authUser || !isOpen) return null;

  return (
    <div className="fixed bottom-20 right-[10%] z-50">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-[350px] h-[500px] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium text-lg">Messages</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {activeChat ? (
            renderActiveChat()
          ) : chatType === 'select' ? (
            renderChatTypeSelection()
          ) : chatType && availableUsers.length > 0 ? (
            renderAvailableUsers()
          ) : (
            renderChatList()
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
