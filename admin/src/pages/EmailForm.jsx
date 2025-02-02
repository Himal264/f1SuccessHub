import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const EmailForm = () => {
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
    file: null,
    targetRoles: [], // New field for selecting target roles
  });
  const [isLoading, setIsLoading] = useState(false);

  // Available roles for targeting
  const availableRoles = [
    { id: 'all', label: 'All Users' },
    { id: 'counselor', label: 'Counselors Only' },
    { id: 'alumni', label: 'Alumni Only' },
    { id: 'university', label: 'Universities Only' },
    { id: 'user', label: 'Standard Users Only' },
  ];

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle role selection
  const handleRoleChange = (roleId) => {
    setFormData(prevData => {
      if (roleId === 'all') {
        // If 'all' is selected, clear other selections
        return {
          ...prevData,
          targetRoles: ['all']
        };
      } else {
        // Remove 'all' if it was previously selected
        let newRoles = prevData.targetRoles.filter(r => r !== 'all');
        
        if (newRoles.includes(roleId)) {
          // Remove role if already selected
          newRoles = newRoles.filter(r => r !== roleId);
        } else {
          // Add role if not selected
          newRoles.push(roleId);
        }
        
        return {
          ...prevData,
          targetRoles: newRoles
        };
      }
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      file: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.targetRoles.length === 0) {
      toast.error("Please select at least one recipient group");
      return;
    }
    
    setIsLoading(true);

    const { subject, body, file, targetRoles } = formData;
    const formPayload = new FormData();
    formPayload.append("subject", subject);
    formPayload.append("body", body);
    formPayload.append("targetRoles", JSON.stringify(targetRoles));
    if (file) formPayload.append("file", file);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${backendUrl}/api/email/broadcast`,
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          subject: "",
          body: "",
          file: null,
          targetRoles: []
        });
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Not authorized. Please log in as admin.");
      } else {
        toast.error(error.response?.data?.message || "Error sending broadcast email");
      }
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full items-start gap-3 p-6 bg-white rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold mb-4">Broadcast Email</h2>

      {/* Target Role Selection */}
      <div className="w-full mb-4">
        <p className="mb-2 font-medium">Select Recipients</p>
        <div className="flex flex-wrap gap-2">
          {availableRoles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => handleRoleChange(role.id)}
              className={`px-4 py-2 rounded-full border transition-colors
                ${formData.targetRoles.includes(role.id)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2 font-medium">Subject</p>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full max-w-[500px] px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter email subject"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2 font-medium">Body</p>
        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          className="w-full max-w-[500px] px-3 py-2 border rounded min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter email body"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.body.length}/1000 characters
        </p>
      </div>

      <div className="w-full">
        <p className="mb-2 font-medium">Attachment</p>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full max-w-[500px] px-3 py-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="px-6 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={isLoading || formData.targetRoles.length === 0}
      >
        {isLoading ? "Sending..." : "Send Email"}
      </button>
    </form>
  );
};

export default EmailForm;
