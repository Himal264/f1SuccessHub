import React, { useState, useEffect } from "react";
import assets from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { IoChatbubbleEllipsesOutline, IoSend } from 'react-icons/io5';
import Chat from './Chat.jsx';
import axios from 'axios';
import { backendUrl } from '../App';

const Navbar = () => {
  const [visible, setVisible] = useState(false); // Track visibility of the sidebar
  const [showLogin, setShowLogin] = useState(false); // New state for login dropdown
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    requestedRole: "user",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profilePicture: null,
    previewUrl: '',
    bio: '',
    socialLinks: {
      website: '',
      linkedin: '',
      twitter: '',
      instagram: ''
    }
  });
  const [showChatContainer, setShowChatContainer] = useState(false);
  const [showF1Dropdown, setShowF1Dropdown] = useState(false);
  const [questionTypes, setQuestionTypes] = useState(['All']);

  // Modified fetch function to properly handle types
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/question/list`);
        
        if (response.data.success) {
          // Extract unique types and filter out empty or null values
          const types = response.data.questions.map(q => q.type)
            .filter(type => type && type.trim()) // Remove empty or null types
            .filter((type, index, self) => self.indexOf(type) === index); // Remove duplicates
          
          // Add 'All' and sort the rest
          const allTypes = ['All', ...types].filter(Boolean);
          console.log('Available question types:', allTypes); // Debug log
          setQuestionTypes(allTypes);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  // Debug log when types change
  useEffect(() => {
    console.log('Current question types:', questionTypes);
  }, [questionTypes]);

  // Function to generate default profile picture URL
  const getDefaultProfilePicture = (name) => {
    if (!name) return '';
    const formattedName = encodeURIComponent(name);
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return `https://ui-avatars.com/api/?name=${formattedName}&background=${randomColor}&color=ffffff`;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo && userInfo !== 'undefined') {
        try {
          const parsedUser = JSON.parse(userInfo);
          // Add default profile picture if none exists
          if (!parsedUser.profilePicture?.url) {
            parsedUser.profilePicture = {
              url: getDefaultProfilePicture(parsedUser.name),
              public_id: ''
            };
            // Update localStorage with default profile picture
            localStorage.setItem('userInfo', JSON.stringify(parsedUser));
          }
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user info:', error);
          localStorage.removeItem('userInfo');
        }
      }
    }
  }, []);

  useEffect(() => {
    if (showLogin) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLogin]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShowProfileDropdown(false);
    // Additional cleanup if needed
  };

  // Function to generate initials avatar
  const getInitialsAvatar = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/loginform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        // Store user info directly
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        setUser(data.user);
        setShowLogin(false);
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Invalid email or password.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    if (signupStep === 1) {
      if (signupData.password !== signupData.confirmPassword) {
        toast.error("Passwords do not match", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      setSignupStep(2);
      return;
    }

    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      if (response.ok) {
        toast.success("Account created successfully! Please check your email for verification.", {
          position: "top-right",
          autoClose: 5000,
        });
        navigate("/success"); // Redirect to the success page
        setIsSigningUp(false);
        setShowLogin(false);
        setSignupStep(1);
        setSignupData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          requestedRole: "user",
        });
      } else {
        const data = await response.json();
        toast.error(data.message || "Registration failed", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during registration.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Update useEffect to properly fetch saved profile data
  useEffect(() => {
    if (user) {
      // Get the role-specific info
      const roleInfo = user[`${user.role}Info`];
      
      // Set the profile data with existing values from the correct nested location
      setProfileData({
        name: user.name,
        email: user.email,
        profilePicture: null,
        previewUrl: user.profilePicture?.url || getDefaultProfilePicture(user.name),
        bio: roleInfo?.documents?.bio || '', // Get bio from documents
        socialLinks: roleInfo?.documents?.socialLinks || { // Get socialLinks from documents
          website: '',
          linkedin: '',
          twitter: '',
          instagram: ''
        }
      });

      // Debug log to verify data
      console.log('Profile Data Loaded:', {
        bio: roleInfo?.documents?.bio,
        socialLinks: roleInfo?.documents?.socialLinks
      });
    }
  }, [user]);

  // Profile update handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      // Handle profile picture update if there's a new one
      if (profileData.profilePicture) {
        const formData = new FormData();
        formData.append('profilePicture', profileData.profilePicture);

        const pictureResponse = await fetch('/api/user/update-profile-picture', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (!pictureResponse.ok) {
          throw new Error('Failed to update profile picture');
        }
      }

      // Update profile info
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profileData.name,
          bio: profileData.bio,
          socialLinks: profileData.socialLinks
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      
      // Update local user state with new data
      if (data.success) {
        const updatedUser = {
          ...user,
          name: data.user.name,
          [`${user.role}Info`]: {
            ...user[`${user.role}Info`],
            documents: {
              ...user[`${user.role}Info`].documents,
              bio: profileData.bio,
              socialLinks: profileData.socialLinks
            }
          }
        };
        
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully');
        setIsEditingProfile(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Error updating profile');
    }
  };

  // Profile picture change handler
  const handleProfilePictureChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setProfileData(prev => ({
      ...prev,
      profilePicture: file,
      previewUrl
    }));
  };

  // Update the chat container logic
  const handleChatClick = () => {
    if (user) {
      setShowChatContainer(!showChatContainer);
    } else {
      setShowLogin(true);
    }
  };

  // Update the profile display section
  const renderProfileView = () => {
    const documents = user[`${user.role}Info`]?.documents || {};
    
    return (
      <div className="px-6 py-4">
        <div className="flex items-center">
          <img 
            src={user.profilePicture?.url || getDefaultProfilePicture(user.name)}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="ml-4">
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            
            {/* Display Bio */}
            {documents.bio && (
              <p className="text-sm text-gray-600 mt-2">
                {documents.bio}
              </p>
            )}
            
            {/* Display Social Links */}
            {documents.socialLinks && (
              <div className="flex gap-3 mt-2">
                {documents.socialLinks.website && (
                  <a href={documents.socialLinks.website} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gray-600 hover:text-gray-800">
                    <i className="fas fa-globe"></i>
                  </a>
                )}
                {documents.socialLinks.linkedin && (
                  <a href={documents.socialLinks.linkedin} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gray-600 hover:text-gray-800">
                    <i className="fab fa-linkedin"></i>
                  </a>
                )}
                {documents.socialLinks.twitter && (
                  <a href={documents.socialLinks.twitter} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gray-600 hover:text-gray-800">
                    <i className="fab fa-twitter"></i>
                  </a>
                )}
                {documents.socialLinks.instagram && (
                  <a href={documents.socialLinks.instagram} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gray-600 hover:text-gray-800">
                    <i className="fab fa-instagram"></i>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Update the edit form section
  const renderEditForm = () => {
    return (
      <form onSubmit={handleProfileUpdate} className="p-4">
        <div className="space-y-4">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <img
              src={profileData.previewUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleProfilePictureChange(e.target.files[0])}
              className="text-sm"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              rows="4"
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium mb-2">Social Links</label>
            <div className="space-y-2">
              {Object.entries(profileData.socialLinks).map(([platform, url]) => (
                <div key={platform} className="flex items-center gap-2">
                  <i className={`fab fa-${platform === 'website' ? 'globe' : platform} w-6`}></i>
                  <input
                    type="url"
                    placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                    value={url}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, [platform]: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#002349] text-white py-2 rounded-md hover:bg-[#002349]"
          >
            Save Changes
          </button>
        </div>
      </form>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between font-medium bg-[#F8F9FA] py-3 w-full relative border-b shadow-sm pl-4 sm:pl-20">
        {/* Logo */}
        <Link to="/">
          <img className="w-36" src={assets.f1successhubLogo} alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex items-center justify-end gap-5 text-sm text-gray-700 ml-auto relative z-10 mr-12">
          <NavLink to="/" className="flex flex-col items-center gap-1 mr-4">
            <p className="text-[#333333]">Home</p>
            <hr className="w-2/4 border-none hidden h-[1.5px] bg-gray-700" />
          </NavLink>
          <NavLink
              to="/f1questionsandanswers"
              className="flex flex-col items-center gap-1 mr-4 text-gray-700 f1-dropdown"
            >
              <p className="text-[#333333]">F1 Questions</p>
              <hr className="w-2/4 border-none hidden h-[1.5px] bg-gray-700" />
            </NavLink>
          <NavLink
            to="/stories"
            className="flex flex-col items-center gap-1 mr-4"
          >
            <p className="text-[#333333]">Stories</p>
            <hr className="w-2/4 border-none hidden h-[1.5px] bg-gray-700" />
          </NavLink>

          <NavLink
            to="/event"
            className="flex flex-col items-center gap-1 mr-4"
          >
            <p className="text-[#333333]">Events</p>
            <hr className="w-2/4 border-none hidden h-[1.5px] bg-gray-700" />
          </NavLink>

          <NavLink
            to="/universityform"
            className="flex flex-col items-center gap-1 mr-4"
          >
            <p className="text-[#F8F9FA] border bg-[#002349] border-[#002349] px-2 rounded-l-full rounded-r-full">
              Find University
            </p>
          </NavLink>

          <NavLink to="/" className="flex flex-col items-center gap-1">
            <img
              src={assets.search_icon}
              className="w-5 cursor-pointer"
              alt=""
            />
          </NavLink>

          {/* Profile Section - Added z-index */}
          <div className="relative z-10">
            <div 
              onClick={() => user ? setShowProfileDropdown(!showProfileDropdown) : setShowLogin(!showLogin)} 
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              {user ? (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src={user.profilePicture?.url || getDefaultProfilePicture(user.name)}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <img
                  src={assets.default_profile_icon}
                  className="w-6 h-6 cursor-pointer rounded-full bg-gray-200 p-1"
                  alt="Profile"
                />
              )}
            </div>

            {/* Profile Dropdown */}
            {showProfileDropdown && user && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
                {!isEditingProfile ? (
                  <>
                    {/* Normal Profile View */}
                    {renderProfileView()}

                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="block w-full text-left px-6 py-3 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit Profile Settings
                    </button>

                    {/* Role-specific Options */}
                    {user.role === 'user' && (
                      <button
                        onClick={() => navigate('/applied-universities')}
                        className="block w-full text-left px-6 py-3 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Applied Universities
                      </button>
                    )}

                    {/* Add Stories and Create Event options for specific roles */}
                    {(user.role === 'counselor' || user.role === 'alumni' || user.role === 'university') && (
                      <>
                        <button
                          onClick={() => navigate('/stories/add')}
                          className="block w-full text-left px-6 py-3 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Add Story
                        </button>
                        <button
                          onClick={() => navigate('/event/add')}
                          className="block w-full text-left px-6 py-3 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Create Event
                        </button>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-6 py-3 text-sm text-[#002349] hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  /* Edit Profile View */
                  renderEditForm()
                )}
              </div>
            )}
          </div>
        </ul>

        {/* Mobile Navigation - Updated */}
        <div className="sm:hidden flex items-center gap-4 mr-24">
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <img
              src={assets.search_icon}
              className="w-5 cursor-pointer"
              alt=""
            />
          </NavLink>
          
          {/* Profile Icon for Mobile */}
          <div 
            onClick={() => user ? setShowProfileDropdown(!showProfileDropdown) : setShowLogin(!showLogin)} 
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            {user ? (
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src={user.profilePicture?.url || getDefaultProfilePicture(user.name)}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <img
                src={assets.default_profile_icon}
                className="w-6 h-6 cursor-pointer rounded-full bg-gray-200 p-1"
                alt="Profile"
              />
            )}
          </div>

          {/* Menu Icon */}
          <img
            onClick={() => setVisible(!visible)}
            src={assets.menu_icon}
            className="w-5 cursor-pointer"
            alt=""
          />
        </div>

        {/* Red Triangle - Updated for mobile responsiveness */}
        <div className="absolute top-0 right-0 w-20 h-full overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-28 h-24 bg-[#002349] transform rotate-45 translate-x-14 -translate-y-14"></div>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Add this section */}
      {visible && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-white shadow-md z-50">
          <NavLink to="/" className="block px-6 py-3 hover:bg-gray-100">
            Home
          </NavLink>
          <NavLink to="/f1questionsandanswers" className="block px-6 py-3 hover:bg-gray-100">
            F1 Questions
          </NavLink>
          <NavLink to="/stories" className="block px-6 py-3 hover:bg-gray-100">
            Stories
          </NavLink>
          <NavLink to="/event" className="block px-6 py-3 hover:bg-gray-100">
            Events
          </NavLink>
          <NavLink to="/universityform" className="block px-6 py-3 hover:bg-gray-100">
            Find University
          </NavLink>
        </div>
      )}

      {/* Update the chat button positioning */}
      <div className={`fixed bottom-5 right-5 z-40 ${showChatContainer ? 'w-11/12 md:w-80' : ''}`}>
        <button
          onClick={handleChatClick}
          className="bg-[#002349] hover:bg-[#002349] text-white rounded-full p-3 shadow-lg transition-all duration-300 ease-in-out hover:scale-110 flex flex-col items-center"
          title={user ? "Open Messages" : "Login to Message"}
        >
          <IoChatbubbleEllipsesOutline size={24} />
          <span className="text-xs mt-1 font-medium">Chat</span>
        </button>

        {/* Render Chat component with proper props */}
        {showChatContainer && (
          <Chat 
            isOpen={showChatContainer} 
            onClose={() => setShowChatContainer(false)}
            user={user}
            className="w-full md:w-80"
          />
        )}
      </div>

      {/* Login/Signup Dropdown Container */}
      {showLogin && (
        <div className="fixed top-0 left-0 w-full h-full flex items-start justify-center overflow-hidden z-50">
          <div className="bg-white shadow-lg mx-auto w-full max-w-md rounded-b-lg mt-20 max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {isSigningUp ? "Create Account" : "Login"}
                </h2>
                <button
                  onClick={() => {
                    setShowLogin(false);
                    setIsSigningUp(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {isSigningUp ? (
                <SignupForm onClose={() => setShowLogin(false)} />
              ) : (
                <LoginForm onClose={() => setShowLogin(false)} />
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isSigningUp ? "Already have an account? " : "Don't have an account? "}
                  <button
                    onClick={() => setIsSigningUp(!isSigningUp)}
                    className="text-[#002349] hover:text-orange-600"
                  >
                    {isSigningUp ? "Login here" : "Create an account"}
                  </button>
                </p>
              </div>
            </div>

           
          </div>
        </div>
      )}

      {/* Update the overlay */}
      {(showLogin || showProfileDropdown) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => {
            setShowLogin(false);
            setShowProfileDropdown(false);
            setShowChatContainer(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
