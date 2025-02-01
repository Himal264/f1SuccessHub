// src/components/LoginForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react"; // Importing eye icons from lucide-react

const LoginForm = ({ onClose = () => {} }) => {
  // State variables to store form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous notifications
    toast.dismiss();

    // Basic client-side validation
    if (!email || !password) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      // Send login request to server
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: password.trim(),
        }),
      });

      // Handle response
      const data = await response.json();
      
      if (response.ok) {
        // Login successful
        localStorage.setItem("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        
        // Show success message
        toast.success("Welcome back! Redirecting...", {
          position: "top-right",
          autoClose: 2000,
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/");
          onClose();
        }, 2000);
      } else {
        // Login failed
        toast.error(data.message || "Login failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      // Handle network errors
      console.error("Login error:", error);
      toast.error("Network error. Please check your connection.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Welcome Back!
      </h2>
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="your@email.com"
            required
          />
        </div>

        {/* Password Input */}
        <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
        Password
      </label>
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-10"
        placeholder="••••••••"
        required
        minLength="6"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200 font-medium"
        >
          Sign In
        </button>

        
      </form>
    </div>
  );
};

export default LoginForm;