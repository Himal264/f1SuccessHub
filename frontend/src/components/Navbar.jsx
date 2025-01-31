import React, { useState, useEffect } from "react";
import assets from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

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

  useEffect(() => {
    // Check for token in localStorage on component mount
    const token = localStorage.getItem('token');
    if (token) {
      // Check if userInfo exists and is not undefined/null before parsing
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo && userInfo !== 'undefined') {
        try {
          setUser(JSON.parse(userInfo));
        } catch (error) {
          console.error('Error parsing user info:', error);
          localStorage.removeItem('userInfo'); // Clear invalid data
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
            to="/aboutus"
            className="flex flex-col items-center gap-1 mr-4"
          >
            <p className="text-sm">About Us</p>
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
                <div className="w-8 h-8 rounded-full bg-[#F37021] text-white flex items-center justify-center font-medium">
                  {getInitialsAvatar(user.name)}
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
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
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

      {/* Overlay for dropdowns */}
      {(showLogin || showProfileDropdown) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            setShowLogin(false);
            setShowProfileDropdown(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
