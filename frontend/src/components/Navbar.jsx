import React, { useState, useEffect } from "react";
import assets from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { IoChatbubbleEllipsesOutline, IoSend } from 'react-icons/io5';
import Chat from './Chat.jsx';

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
    previewUrl: ''
  });
  const [showChatContainer, setShowChatContainer] = useState(false);

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

  // Initialize profile data when user is loaded
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        profilePicture: null,
        previewUrl: user.profilePicture?.url || getDefaultProfilePicture(user.name)
      });
    }
  }, [user]);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
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
          const errorData = await pictureResponse.json();
          throw new Error(errorData.message || 'Failed to update profile picture');
        }

        const pictureData = await pictureResponse.json();
        if (pictureData.success) {
          // Update profile picture in state
          const updatedUser = {
            ...user,
            profilePicture: pictureData.profilePicture
          };
          setUser(updatedUser);
          localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        }
      }

      // Update name
      const nameResponse = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profileData.name
        })
      });

      if (!nameResponse.ok) {
        const errorData = await nameResponse.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const nameData = await nameResponse.json();
      if (nameData.success) {
        const updatedUser = {
          ...user,
          name: profileData.name
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

  const handleProfilePictureChange = (file) => {
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    // Create preview URL
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

  return (
    <>
      <div className="flex items-center justify-between font-medium py-5 w-full">
        {/* Logo */}
        <Link to="/">
          <img className="w-36" src={assets.f1successhubLogo} alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex items-center justify-end gap-5 text-sm text-gray-700 ml-auto">
          <NavLink to="/" className="flex flex-col items-center gap-1 mr-4">
            <p className="text-sm">Home</p>
            <hr className="w-2/4 border-none hidden h-[1.5px] bg-gray-700" />
          </NavLink>
          <NavLink
            to="/f1questionsandanswers/:f1questionsandanswersId"
            className="flex flex-col items-center gap-1 mr-4"
          >
            <p className="text-sm">F1 Questions</p>
            <hr className="w-2/4 border-none hidden h-[1.5px] bg-gray-700" />
          </NavLink>
          <NavLink
            to="/f1successhub-ourservices"
            className="flex flex-col items-center gap-1 mr-4"
          >
            <p className="text-sm">Our Services</p>
            <hr className="w-2/4 border-none hidden h-[1.5px] bg-gray-700" />
          </NavLink>

          <NavLink
            to="/event"
            className="flex flex-col items-center gap-1 mr-4"
          >
            <p className="text-sm">Events</p>
            <hr className="w-2/4 border-none hidden h-[1.5px] bg-gray-700" />
          </NavLink>

          <NavLink
            to="/universityform"
            className="flex flex-col items-center gap-1 mr-4"
          >
            <p className="text-sm text-white border bg-[#F37021]  border-[#F37021] px-2 rounded-l-full rounded-r-full">
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

          {/* Profile Section */}
          <div className="relative">
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
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg py-1 z-50">
                {!isEditingProfile ? (
                  // Regular profile view
                  <>
                    <div className="px-4 py-3 border-b">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={user.profilePicture?.url || getDefaultProfilePicture(user.name)}
                          alt={user.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div className="flex-1">
                          <p className="text-lg font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-sm font-medium text-gray-700 capitalize mt-1">
                            {user.role === 'user' ? 'Standard User' : user.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-2 space-y-1">
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="block w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Profile Settings
                        </div>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <svg className="mr-3 h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Applied Universities
                        </div>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <svg className="mr-3 h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </div>
                      </button>
                    </div>
                  </>
                ) : (
                  // Edit profile form
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Edit Profile</h3>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      {/* Profile Picture Upload */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="relative group">
                          <img 
                            src={profileData.previewUrl}
                            alt={profileData.name}
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                          />
                          <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleProfilePictureChange(e.target.files[0])}
                            />
                            <div className="text-white text-xs flex flex-col items-center">
                              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>Change Photo</span>
                            </div>
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">Click to change profile picture</p>
                      </div>

                      {/* Name Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      {/* Email (Read-only) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Platform Rules */}
                <div className="px-4 py-3 mt-2 border-t bg-gray-50">
                  <p className="text-xs font-medium text-gray-500 mb-2">Platform Rules:</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      Maintain professional conduct
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      Respect community guidelines
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      Keep information accurate and updated
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      Report any suspicious activity
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </ul>

        {/* Search Icon & Mobile Menu */}
        <div className="flex items-center gap-6">
          <img
            onClick={() => setVisible(!visible)} // Toggle sidebar visibility
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt=""
          />
        </div>

        {/* Sidebar Menu for Small Screens */}
        <div
          className={`absolute top-0 left-0 bottom-0 z-50 bg-white transition-all duration-300 ease-in-out ${
            visible ? "w-full opacity-100" : "w-0 opacity-0"
          } sm:hidden`}
        >
          {/* Sidebar Content */}
          <div
            className={`flex flex-col text-gray-600 h-full transition-all duration-300 ease-in-out ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              onClick={() => setVisible(false)} // Close the sidebar
              className="flex items-center gap-4 p-3 cursor-pointer"
            >
              <img
                className="h-4 rotate-180"
                src={assets.dropdown_icon}
                alt=""
              />
              <p>Back</p>
            </div>
            <NavLink
              onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
              className="py-2 pl-6 border-b"
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
              className="py-2 pl-6 border-b"
              to="/universityform"
            >
              Find University
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
              className="py-2 pl-6 border-b"
              to="/f1questionsandanswers/:f1questionsandanswersId"
            >
              F1 Questions
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
              className="py-2 pl-6 border-b"
              to="/f1successhub-ourservices"
            >
              The Services We Provide ?
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
              className="py-2 pl-6 border-b"
              to="/f1successhub-ourpatners"
            >
              Our Patners ?
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
              className="py-2 pl-6 border-b"
              to="/forf1success"
            >
              What F1 Visa Success Matters?
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
              className="py-2 pl-6 border-b"
              to="/f1successhubfaqs?"
            >
              F1SuccessHub FAQs?
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
              className="py-2 pl-6 border-b"
              to="/aboutus"
            >
              About Us
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
              className="py-2 pl-6 border-b"
              to="/loginform"
            >
              Profile
            </NavLink>
          </div>
        </div>
      </div>

      {/* Update the chat button positioning */}
      <div className="fixed bottom-5 right-[10%] z-40">
        <button
          onClick={handleChatClick}
          className="bg-[#F37021] hover:bg-[#e85d0a] text-white rounded-full p-3 shadow-lg transition-all duration-300 ease-in-out hover:scale-110 flex flex-col items-center"
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
                    className="text-[#F37021] hover:text-orange-600"
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
