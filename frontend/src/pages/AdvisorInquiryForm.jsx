import React, { useState, useEffect } from "react";
import { backendUrl } from "../App";

const AdvisorInquiryForm = () => {
  // Country and phone code mapping
  const countryData = [
    { country: "United States", code: "+1", flag: "🇺🇸" },
    { country: "United Kingdom", code: "+44", flag: "🇬🇧" },
    { country: "India", code: "+91", flag: "🇮🇳" },
    { country: "China", code: "+86", flag: "🇨🇳" },
    { country: "Canada", code: "+1", flag: "🇨🇦" },
    { country: "Australia", code: "+61", flag: "🇦🇺" },
    { country: "Germany", code: "+49", flag: "🇩🇪" },
    { country: "Japan", code: "+81", flag: "🇯🇵" },
  ];

  const intakes = [
    "January 2025",
    "February 2025",
    "March 2025",
    "April 2025",
    "May 2025",
    "June 2025",
    "July 2025",
    "August 2025",
    "September 2025",
    "October 2025",
    "November 2025",
    "December 2025",
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    intakes,
    countryOfOrigin: "",
    phoneCode: "",
    mobileNumber: "",
    degreeType: "",
    startDate: "",
    tuitionBudget: "",
    citizenship: "",
    message: "",
    subscribeNews: false,
  });

  const [errors, setErrors] = useState({});

  // Update phone code when country changes
  useEffect(() => {
    if (formData.countryOfOrigin) {
      const selectedCountry = countryData.find(
        (item) => item.country === formData.countryOfOrigin
      );
      if (selectedCountry) {
        setFormData((prev) => ({
          ...prev,
          phoneCode: selectedCountry.code,
        }));
      }
    }
  }, [formData.countryOfOrigin]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email required";
    if (!formData.countryOfOrigin) newErrors.countryOfOrigin = "Required";
    if (!formData.degreeType) newErrors.degreeType = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Replace with your API endpoint
      const response = await fetch(
         `${backendUrl}/api/advisor-inquiryform/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Form submitted successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          countryOfOrigin: "",
          phoneCode: "",
          mobileNumber: "",
          degreeType: "",
          startDate: "",
          tuitionBudget: "",
          citizenship: "",
          message: "",
          subscribeNews: false,
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Ask an Advisor</h2>
      <p className="text-gray-600 mb-8">
        Our education counselors help you every step of the way at no additional
        cost to you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm mt-1">
                {errors.firstName}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">{errors.email}</span>
          )}
        </div>

        {/* Country and Phone */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country of Origin
            </label>
            <select
              name="countryOfOrigin"
              value={formData.countryOfOrigin}
              onChange={handleInputChange}
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a country</option>
              {countryData.map(({ country, flag }) => (
                <option key={country} value={country}>
                  {flag} {country}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Code
              </label>
              <input
                type="text"
                value={formData.phoneCode}
                className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50"
                disabled
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Degree Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Degree Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[
              "Undergraduate",
              "Graduate",
              "English Proficiency",
              "Certificate",
            ].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="degreeType"
                  value={type.toLowerCase()}
                  checked={formData.degreeType === type.toLowerCase()}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <select
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>
              Select an intake
            </option>
            {intakes.map((intake) => (
              <option key={intake} value={intake}>
                {intake}
              </option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Annual Tuition Budget
          </label>
          <select
            name="tuitionBudget"
            value={formData.tuitionBudget}
            onChange={handleInputChange}
            className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select budget range</option>
            {["$10,000", "$20,000", "$30,000", "$40,000", "Above $40,000"].map(
              (budget) => (
                <option key={budget} value={budget}>
                  {budget}
                </option>
              )
            )}
          </select>
        </div>

        {/* Citizenship */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Citizenship Status
          </label>
          <div className="flex space-x-6">
            {["Non-US Citizen", "US Citizen"].map((status) => (
              <label key={status} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="citizenship"
                  value={status.toLowerCase()}
                  checked={formData.citizenship === status.toLowerCase()}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message (Optional)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="What can we help you with?"
          />
        </div>

        {/* Newsletter Subscription */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="subscribeNews"
            checked={formData.subscribeNews}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="text-sm text-gray-700">
            Yes, I would like to receive news and information from F1SuccessHub
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AdvisorInquiryForm;
