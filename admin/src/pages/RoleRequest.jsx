import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const RoleRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        
        const response = await axios.get(
          "http://localhost:9000/api/user/verification-requests",
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` // Add admin token
            },
            withCredentials: true,
          }
        );

        console.log("Full response:", response);

        if (response.data && response.data.success) {
          setRequests(response.data.data || []);
          if (response.data.count === 0) {
            console.log("No pending requests found");
          }
        } else {
          console.log("Unexpected response structure:", response.data);
          setRequests([]);
        }
      } catch (err) {
        console.error("Detailed error:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch verification requests";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle request approval/rejection
  const handleVerification = async (userId, status, feedback = "") => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:9000/api/user/verify-role/${userId}`,
        {
          status,
          adminFeedback: feedback,
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`
          },
          withCredentials: true,
        }
      );

      // Update the local state to reflect the change
      setRequests(requests.filter((request) => request._id !== userId));
      toast.success(`Request ${status} successfully`);
    } catch (err) {
      console.error("Verification error:", err);
      setError("Failed to update verification status");
      toast.error("Failed to update verification status");
    }
  };

  // Image preview modal
  const ImagePreviewModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="relative max-w-4xl w-full">
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-white text-xl font-bold"
          >
            ✕
          </button>
          <img
            src={imageUrl}
            alt="Document Preview"
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        </div>
      </div>
    );
  };

  // Function to render document links based on role
  const renderDocuments = (request) => {
    const role = request.verificationRequest.requestedRole;
    let documents = [];

    switch (role) {
      case "alumni":
        if (request.alumniInfo?.documents) {
          const {
            academicCertificate,
            studentIdCard,
            transcript,
            employmentProof,
            otherDocuments,
          } = request.alumniInfo.documents;

          if (academicCertificate?.url) {
            documents.push({
              label: "Academic Certificate",
              url: academicCertificate.url,
            });
          }
          if (studentIdCard?.url) {
            documents.push({
              label: "Student ID Card",
              url: studentIdCard.url,
            });
          }
          if (transcript?.url) {
            documents.push({
              label: "Transcript",
              url: transcript.url,
            });
          }
          if (employmentProof?.url) {
            documents.push({
              label: "Employment Proof",
              url: employmentProof.url,
            });
          }
          if (otherDocuments && otherDocuments.length > 0) {
            otherDocuments.forEach((doc, index) => {
              documents.push({
                label: `Additional Document ${index + 1}`,
                url: doc.url,
              });
            });
          }
        }
        break;

      case "counselor":
        if (request.counselorInfo?.documents) {
          const {
            professionalCertification,
            experienceLetter,
            licenseDocument,
            professionalId,
            resume,
            otherDocuments,
          } = request.counselorInfo.documents;

          if (professionalCertification?.url) {
            documents.push({
              label: "Professional Certification",
              url: professionalCertification.url,
            });
          }
          if (experienceLetter?.url) {
            documents.push({
              label: "Experience Letter",
              url: experienceLetter.url,
            });
          }
          if (licenseDocument?.url) {
            documents.push({
              label: "License Document",
              url: licenseDocument.url,
            });
          }
          if (professionalId?.url) {
            documents.push({
              label: "Professional ID",
              url: professionalId.url,
            });
          }
          if (resume?.url) {
            documents.push({
              label: "Resume",
              url: resume.url,
            });
          }
          if (otherDocuments && otherDocuments.length > 0) {
            otherDocuments.forEach((doc, index) => {
              documents.push({
                label: `Additional Document ${index + 1}`,
                url: doc.url,
              });
            });
          }
        }
        break;

      case "university":
        if (request.universityInfo?.documents) {
          const {
            accreditationCertificate,
            institutionLicense,
            registrationDocument,
            taxRegistration,
            authorizationLetter,
            otherDocuments,
          } = request.universityInfo.documents;

          if (accreditationCertificate?.url) {
            documents.push({
              label: "Accreditation Certificate",
              url: accreditationCertificate.url,
            });
          }
          if (institutionLicense?.url) {
            documents.push({
              label: "Institution License",
              url: institutionLicense.url,
            });
          }
          if (registrationDocument?.url) {
            documents.push({
              label: "Registration Document",
              url: registrationDocument.url,
            });
          }
          if (taxRegistration?.url) {
            documents.push({
              label: "Tax Registration",
              url: taxRegistration.url,
            });
          }
          if (authorizationLetter?.url) {
            documents.push({
              label: "Authorization Letter",
              url: authorizationLetter.url,
            });
          }
          if (otherDocuments && otherDocuments.length > 0) {
            otherDocuments.forEach((doc, index) => {
              documents.push({
                label: `Additional Document ${index + 1}`,
                url: doc.url,
              });
            });
          }
        }
        break;

      default:
        break;
    }

    return documents.length > 0 ? (
      <div className="grid grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="flex flex-col space-y-2 p-4 border rounded-lg bg-gray-50"
          >
            <span className="text-sm font-medium text-gray-700">
              {doc.label}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedImage(doc.url)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                View Image
              </button>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 italic">No documents uploaded</p>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Role Verification Requests</h1>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!loading && !error && (!requests || requests.length === 0) && (
        <div className="text-gray-500 text-center p-8 bg-gray-50 rounded-lg">
          No pending verification requests
        </div>
      )}

      {!loading && !error && requests.length > 0 && (
        <div className="grid gap-6">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{request.name}</h2>
                  <p className="text-gray-600">{request.email}</p>
                  <p className="text-blue-600 font-medium">
                    Requested Role: {request.verificationRequest.requestedRole}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </div>

              {/* Role-specific information */}
              {request.verificationRequest.requestedRole === "alumni" && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Alumni Details:</h3>
                  <p>University: {request.alumniInfo.universityName}</p>
                  <p>Degree: {request.alumniInfo.degree}</p>
                  <p>
                    Study Period:{" "}
                    {new Date(request.alumniInfo.startStudy).getFullYear()} -{" "}
                    {new Date(request.alumniInfo.endStudy).getFullYear()}
                  </p>
                </div>
              )}

              {request.verificationRequest.requestedRole === "counselor" && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Counselor Details:</h3>
                  <p>Certified By: {request.counselorInfo.certifiedCompany}</p>
                  <p>
                    Associated Company:{" "}
                    {request.counselorInfo.associatedCompany}
                  </p>
                </div>
              )}

              {request.verificationRequest.requestedRole === "university" && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">University Details:</h3>
                  <p>Name: {request.universityInfo.universityName}</p>
                  <p>Location: {request.universityInfo.location}</p>
                  <p>Established: {request.universityInfo.establishedYear}</p>
                </div>
              )}

              {/* Documents Section */}
              <div className="mb-6">
                <h3 className="font-medium mb-4">Submitted Documents:</h3>
                {renderDocuments(request)}
              </div>

              {/* Admin Feedback and Actions */}
              <div className="space-y-4">
                <textarea
                  className="w-full p-3 border rounded-md"
                  placeholder="Add feedback (optional)"
                  rows="3"
                  id={`feedback-${request._id}`}
                />
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      handleVerification(
                        request._id,
                        "approved",
                        document.getElementById(`feedback-${request._id}`).value
                      )
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleVerification(
                        request._id,
                        "rejected",
                        document.getElementById(`feedback-${request._id}`).value
                      )
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleRequest;
