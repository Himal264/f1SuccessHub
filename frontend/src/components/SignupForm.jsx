import React, { useState } from "react";
import { toast } from "react-toastify";

const SignupForm = ({ onClose }) => {
  const [signupStep, setSignupStep] = useState(1);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    requestedRole: "user",
    alumniInfo: {
      universityName: "",
      startStudy: "",
      endStudy: "",
      degree: "",
      currentCompany: "",
      certifiedCompany: "",
    },
    counselorInfo: {
      certification: "",
      experienceYears: "",
      certifiedCompany: "",
      associatedCompany: "",
    },
    universityInfo: {
      universityName: "",
      establishedYear: "",
      location: "",
      accreditation: "",
      programsOffered: "",
      website: "",
      contactEmail: "",
      contactPhone: "",
    },
    documents: {},
  });

  const roleDocuments = {
    alumni: [
      { label: "Academic Certificate", required: true }, // Changed from "Degree Certificate"
      { label: "Student ID Card", required: true },
      { label: "Transcript", required: true },
      { label: "Employment Proof", required: true }
    ],
    counselor: [
      { label: "Professional Certification", required: true },
      { label: "Experience Letter", required: true },
      { label: "License Document", required: true },
      { label: "Professional ID", required: true },
      { label: "Resume", required: true },
    ],
    university: [
      { label: "Accreditation Certificate", required: true },
      { label: "Institution License", required: true },
      { label: "Registration Document", required: true },
      { label: "Tax Registration", required: true },
      { label: "Authorization Letter", required: true },
    ],
    user: [],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setSignupData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setSignupData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Only images (JPG, JPEG, PNG) are allowed.");
        e.target.value = "";
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File is too large. Maximum size is 2MB.");
        e.target.value = "";
        return;
      }
      setSignupData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [documentType]: file,
        },
      }));
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

    // Validate required fields for alumni
    if (signupData.requestedRole === "alumni") {
      const { universityName, startStudy, endStudy, degree } = signupData.alumniInfo;
      if (!universityName || !startStudy || !endStudy || !degree) {
        toast.error("Please fill in all required fields for alumni.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", signupData.name);
    formDataToSend.append("email", signupData.email);
    formDataToSend.append("password", signupData.password);
    formDataToSend.append("requestedRole", signupData.requestedRole);

    let additionalInfo = {};
    if (signupData.requestedRole === "alumni") {
      additionalInfo = { ...signupData.alumniInfo };
    } else if (signupData.requestedRole === "counselor") {
      additionalInfo = { ...signupData.counselorInfo };
    } else if (signupData.requestedRole === "university") {
      additionalInfo = { ...signupData.universityInfo };
    }
    formDataToSend.append("additionalInfo", JSON.stringify(additionalInfo));

    const requiredDocs = roleDocuments[signupData.requestedRole].filter((doc) => doc.required);
    for (const doc of requiredDocs) {
      const docKey = doc.label.toLowerCase().replace(/\s+/g, "_");
      if (signupData.documents[docKey]) {
        formDataToSend.append(docKey, signupData.documents[docKey]);
      }
    }

    // Log FormData entries
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch("http://localhost:9000/api/user/register", {
        method: "POST",
        body: formDataToSend,
      });

      const responseData = await response.json(); // Add this line
      console.log('Server response:', responseData); // Add this line
    

      if (response.ok) {
        toast.success("Account created successfully! Please check your email for verification.", {
          position: "top-right",
          autoClose: 5000,
        });
        onClose();
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

  const renderRoleSpecificFields = () => {
    switch (signupData.requestedRole) {
      case "alumni":
        return (
          <div className="space-y-4">
            <input
              type="text"
              name="alumniInfo.universityName"
              placeholder="University Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={signupData.alumniInfo.universityName}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="alumniInfo.startStudy"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={signupData.alumniInfo.startStudy}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="alumniInfo.endStudy"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={signupData.alumniInfo.endStudy}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="text"
              name="alumniInfo.degree"
              placeholder="Degree Obtained"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={signupData.alumniInfo.degree}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="alumniInfo.currentCompany"
              placeholder="Current Company"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={signupData.alumniInfo.currentCompany}
              onChange={handleChange}
            />
          </div>
        );

      case "counselor":
        return (
          <div className="space-y-4">
            <input
              type="text"
              name="counselorInfo.certification"
              placeholder="Certification Details"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={signupData.counselorInfo.certification}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="counselorInfo.experienceYears"
              placeholder="Years of Experience"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={signupData.counselorInfo.experienceYears}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="counselorInfo.certifiedCompany"
              placeholder="Certifying Company"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={signupData.counselorInfo.certifiedCompany}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="counselorInfo.associatedCompany"
              placeholder="Associated Company"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={signupData.counselorInfo.associatedCompany}
              onChange={handleChange}
            />
          </div>
        );

      case "university":
        return (
          <div className="space-y-4">
            <input
              type="text"
              name="universityInfo.universityName"
              placeholder="University Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={signupData.universityInfo.universityName}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="universityInfo.establishedYear"
              placeholder="Year Established"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={signupData.universityInfo.establishedYear}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="universityInfo.location"
              placeholder="Location"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={signupData.universityInfo.location}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="universityInfo.accreditation"
              placeholder="Accreditation Details"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={signupData.universityInfo.accreditation}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="universityInfo.programsOffered"
              placeholder="Programs Offered"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={signupData.universityInfo.programsOffered}
              onChange={handleChange}
              required
            />
            <input
              type="url"
              name="universityInfo.website"
              placeholder="Website URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={signupData.universityInfo.website}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                name="universityInfo.contactEmail"
                placeholder="Contact Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={signupData.universityInfo.contactEmail}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="universityInfo.contactPhone"
                placeholder="Contact Phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={signupData.universityInfo.contactPhone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderDocumentUpload = () => {
    const documents = roleDocuments[signupData.requestedRole];

    if (!documents || documents.length === 0) return null;

    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Required Documents (Images Only)
        </h3>
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="border border-gray-200 p-4 rounded-lg bg-white"
            >
              <div className="flex justify-between items-start mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {doc.label}{" "}
                  {doc.required && <span className="text-red-500">*</span>}
                </label>
                {signupData.documents[
                  doc.label.toLowerCase().replace(/\s+/g, "_")
                ] && (
                  <span className="text-sm text-green-600">
                    File selected ✓
                  </span>
                )}
              </div>
              <input
                type="file"
                onChange={(e) =>
                  handleFileChange(
                    e,
                    doc.label.toLowerCase().replace(/\s+/g, "_")
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required={doc.required}
                accept="image/jpeg,image/jpg,image/png"
              />
              <p className="mt-2 text-sm text-gray-500">
                {doc.required
                  ? "This document is required for verification"
                  : "Optional supporting document"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Accepted formats: JPG, JPEG, PNG (Max size: 2MB)
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSignupSubmit} className="space-y-4">
      {signupStep === 1 ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={signupData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={signupData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={signupData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={signupData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Role</label>
            <select
              name="requestedRole"
              value={signupData.requestedRole}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="user">Regular User</option>
              <option value="alumni">Alumni</option>
              <option value="counselor">Counselor</option>
              <option value="university">University</option>
            </select>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {renderRoleSpecificFields()}
          {renderDocumentUpload()}
        </div>
      )}

      <div className="flex gap-4">
        {signupStep === 2 && (
          <button
            type="button"
            onClick={() => setSignupStep(1)}
            className="w-1/2 bg-gray-200 text-gray-800 py-2 px-4 rounded-md"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          className={`${signupStep === 2 ? 'w-1/2' : 'w-full'} bg-[#F37021] text-white py-2 px-4 rounded-md`}
        >
          {signupStep === 1 ? "Next" : "Create Account"}
        </button>
      </div>
    </form>
  );
};

export default SignupForm; 