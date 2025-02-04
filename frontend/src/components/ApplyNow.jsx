import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const ApplyNow = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {
      homeAddress: {
        street1: '',
        street2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Nepal',
      },
      livingInUS: false,
      phone: {
        mobile: {
          countryCode: '+977',
          number: '',
        },
        home: {
          countryCode: '+977',
          number: '',
        },
      },
      emergencyContact: {
        relationship: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: {
          countryCode: '',
          number: '',
        },
        sameAsHome: false,
      },
    },
    contactInfo: {
      homeAddress: {
        street1: '',
        street2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Nepal',
      },
      livingInUS: false,
      phone: {
        mobile: {
          countryCode: '+977',
          number: '',
        },
        home: {
          countryCode: '+977',
          number: '',
        },
      },
      emergencyContact: {
        relationship: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: {
          countryCode: '',
          number: '',
        },
        sameAsHome: false,
      },
    },
    educationHistory: {
      secondarySchool: {
        name: '',
        city: '',
        country: '',
        startDate: {
          month: '',
          year: '',
        },
        graduationDate: {
          month: '',
          year: '',
        },
        advancedStandingCredits: false,
      },
      otherSchools: false,
      postSecondary: false,
      satAct: false,
      academicGaps: false,
    },
    documents: {
      hasDocuments: false,
      files: [],
    },
    agreements: {
      disciplinaryAction: false,
      criminalOffense: false,
      autoApply: false,
      enrollmentContract: false,
      medicalInsurance: false,
      declarations: false,
    },
    programDetails: {
      studyLevel: location.state?.studyLevel || '',
      program: location.state?.program || '',
      university: location.state?.university || '',
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [universityData, setUniversityData] = useState(null);
  const [level, setLevel] = useState(location.state?.level || "Graduate");

  useEffect(() => {
    // If we have university data in state, use that
    if (location.state?.university) {
      setUniversityData({ university: location.state.university });
      return;
    }

    // Otherwise fetch from API
    const fetchUniversity = async () => {
      if (!id) return;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/university/${id}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setUniversityData(data);
      } catch (error) {
        console.error("Error fetching university:", error);
      }
    };
    fetchUniversity();
  }, [id, location.state]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFileUpload = (files) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        files: [...prev.documents.files, ...files],
      },
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    // Add validation logic for each step
    // Return true if valid, false if invalid
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:9000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Submission failed');

      const data = await response.json();
      navigate('/application-success', { state: { applicationId: data.id } });
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setShowForm(true);
  };

  // If form is not yet shown, display the welcome/email entry page
  if (!showForm) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-12">
          {/* University Header */}
          <div className="flex items-center gap-4 mb-8">
            <img 
              src={universityData?.university?.logoUrl || "/api/placeholder/48/48"}
              alt="University of Georgia Logo"
              className="h-10"
            />
            <div>
              <h1 className="text-2xl font-bold text-[#BA0C2F]">
                {universityData?.university?.name}
              </h1>
              <div className="text-sm text-gray-600">{level}</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            A few things before you start:
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600">
                It will take approximately 15-20 minutes to complete the application.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <p className="text-gray-600">
                Your information is automatically saved as you complete each step.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-600">
                You can exit and resume the application at a later time by entering your email address.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-gray-600">
                We understand the importance of trust and security, so your personal information is always safeguarded to industry-best practices.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">To start or continue an application</h2>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Enter Your Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continue
              </button>
            </form>
            <p className="mt-4 text-sm text-gray-500 text-center">
              If you have trouble accessing the application,
              <br />
              please contact <a href="#" className="text-blue-600 hover:underline">customer support</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Personal Information</h2>
            
            {/* Permanent Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Permanent Home Address (outside of United States)</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Home street address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.homeAddress.street1}
                    onChange={(e) => handleInputChange('personalInfo', 'homeAddress', {
                      ...formData.personalInfo.homeAddress,
                      street1: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Home street address line 2 (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.homeAddress.street2}
                    onChange={(e) => handleInputChange('personalInfo', 'homeAddress', {
                      ...formData.personalInfo.homeAddress,
                      street2: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.homeAddress.city}
                      onChange={(e) => handleInputChange('personalInfo', 'homeAddress', {
                        ...formData.personalInfo.homeAddress,
                        city: e.target.value
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Province / State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.homeAddress.state}
                      onChange={(e) => handleInputChange('personalInfo', 'homeAddress', {
                        ...formData.personalInfo.homeAddress,
                        state: e.target.value
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                {/* Continue with more fields... */}
              </div>
            </div>

            {/* Living in US Question */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Are you currently living in the United States?</h3>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="livingInUS"
                    value="yes"
                    checked={formData.personalInfo.livingInUS}
                    onChange={(e) => handleInputChange('personalInfo', 'livingInUS', e.target.value === 'yes')}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="livingInUS"
                    value="no"
                    checked={!formData.personalInfo.livingInUS}
                    onChange={(e) => handleInputChange('personalInfo', 'livingInUS', e.target.value === 'yes')}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Phone Numbers Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Phone Number</h3>
              
              {/* Mobile Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">Mobile phone</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Country code</label>
                    <select
                      value={formData.personalInfo.phone.mobile.countryCode}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', {
                        ...formData.personalInfo.phone,
                        mobile: { ...formData.personalInfo.phone.mobile, countryCode: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="+977">+977</option>
                      {/* Add more country codes */}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">
                      Phone number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.personalInfo.phone.mobile.number}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', {
                        ...formData.personalInfo.phone,
                        mobile: { ...formData.personalInfo.phone.mobile, number: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Emergency Contact Details</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.personalInfo.emergencyContact.relationship}
                    onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                      ...formData.personalInfo.emergencyContact,
                      relationship: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select relationship</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    {/* Add more options */}
                  </select>
                </div>

                {/* Continue with emergency contact fields */}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Contact Information</h2>
            
            {/* Permanent Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Permanent Home Address (outside of United States)</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Home street address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.homeAddress.street1}
                  onChange={(e) => handleInputChange('contactInfo', 'homeAddress', {
                    ...formData.contactInfo.homeAddress,
                    street1: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Home street address line 2 (optional)
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.homeAddress.street2}
                  onChange={(e) => handleInputChange('contactInfo', 'homeAddress', {
                    ...formData.contactInfo.homeAddress,
                    street2: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.homeAddress.city}
                    onChange={(e) => handleInputChange('contactInfo', 'homeAddress', {
                      ...formData.contactInfo.homeAddress,
                      city: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Province / State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.homeAddress.state}
                    onChange={(e) => handleInputChange('contactInfo', 'homeAddress', {
                      ...formData.contactInfo.homeAddress,
                      state: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Postal code (optional)
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.homeAddress.postalCode}
                  onChange={(e) => handleInputChange('contactInfo', 'homeAddress', {
                    ...formData.contactInfo.homeAddress,
                    postalCode: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <select
                  value={formData.contactInfo.homeAddress.country}
                  onChange={(e) => handleInputChange('contactInfo', 'homeAddress', {
                    ...formData.contactInfo.homeAddress,
                    country: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                  disabled
                >
                  <option value="Nepal">Nepal</option>
                </select>
              </div>
            </div>

            {/* Living in US Question */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Are you currently living in the United States?</h3>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="contactLivingInUS"
                    value="yes"
                    checked={formData.contactInfo.livingInUS}
                    onChange={(e) => handleInputChange('contactInfo', 'livingInUS', e.target.value === 'yes')}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="contactLivingInUS"
                    value="no"
                    checked={!formData.contactInfo.livingInUS}
                    onChange={(e) => handleInputChange('contactInfo', 'livingInUS', e.target.value === 'yes')}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Phone Numbers Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Phone Number</h3>
              
              {/* Mobile Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">Mobile phone</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Country code</label>
                    <select
                      value={formData.contactInfo.phone.mobile.countryCode}
                      onChange={(e) => handleInputChange('contactInfo', 'phone', {
                        ...formData.contactInfo.phone,
                        mobile: { ...formData.contactInfo.phone.mobile, countryCode: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                      disabled
                    >
                      <option value="+977">+977</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">
                      Phone number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.contactInfo.phone.mobile.number}
                      onChange={(e) => handleInputChange('contactInfo', 'phone', {
                        ...formData.contactInfo.phone,
                        mobile: { ...formData.contactInfo.phone.mobile, number: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Home Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">Home phone (optional)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Country code</label>
                    <select
                      value={formData.contactInfo.phone.home.countryCode}
                      onChange={(e) => handleInputChange('contactInfo', 'phone', {
                        ...formData.contactInfo.phone,
                        home: { ...formData.contactInfo.phone.home, countryCode: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                      disabled
                    >
                      <option value="+977">+977</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Phone number</label>
                    <input
                      type="tel"
                      value={formData.contactInfo.phone.home.number}
                      onChange={(e) => handleInputChange('contactInfo', 'phone', {
                        ...formData.contactInfo.phone,
                        home: { ...formData.contactInfo.phone.home, number: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Contact Details</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.contactInfo.emergencyContact.relationship}
                  onChange={(e) => handleInputChange('contactInfo', 'emergencyContact', {
                    ...formData.contactInfo.emergencyContact,
                    relationship: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select relationship</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First name of emergency contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.emergencyContact.firstName}
                    onChange={(e) => handleInputChange('contactInfo', 'emergencyContact', {
                      ...formData.contactInfo.emergencyContact,
                      firstName: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last name of emergency contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.emergencyContact.lastName}
                    onChange={(e) => handleInputChange('contactInfo', 'emergencyContact', {
                      ...formData.contactInfo.emergencyContact,
                      lastName: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.contactInfo.emergencyContact.email}
                  onChange={(e) => handleInputChange('contactInfo', 'emergencyContact', {
                    ...formData.contactInfo.emergencyContact,
                    email: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* Emergency Contact Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">Emergency contact phone</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">
                      Country code <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.contactInfo.emergencyContact.phone.countryCode}
                      onChange={(e) => handleInputChange('contactInfo', 'emergencyContact', {
                        ...formData.contactInfo.emergencyContact,
                        phone: { ...formData.contactInfo.emergencyContact.phone, countryCode: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select country code</option>
                      <option value="+977">+977</option>
                      {/* Add more country codes as needed */}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">
                      Phone number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.contactInfo.emergencyContact.phone.number}
                      onChange={(e) => handleInputChange('contactInfo', 'emergencyContact', {
                        ...formData.contactInfo.emergencyContact,
                        phone: { ...formData.contactInfo.emergencyContact.phone, number: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Same as Home Address Question */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Is the emergency contact's address the same as your home address?
                </h3>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="sameAsHome"
                      value="yes"
                      checked={formData.contactInfo.emergencyContact.sameAsHome}
                      onChange={(e) => handleInputChange('contactInfo', 'emergencyContact', {
                        ...formData.contactInfo.emergencyContact,
                        sameAsHome: e.target.value === 'yes'
                      })}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="sameAsHome"
                      value="no"
                      checked={!formData.contactInfo.emergencyContact.sameAsHome}
                      onChange={(e) => handleInputChange('contactInfo', 'emergencyContact', {
                        ...formData.contactInfo.emergencyContact,
                        sameAsHome: e.target.value === 'yes'
                      })}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Education History</h2>
            
            {/* Secondary School Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Secondary / High School Details</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name of School <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.educationHistory.secondarySchool.name}
                  onChange={(e) => handleInputChange('educationHistory', 'secondarySchool', {
                    ...formData.educationHistory.secondarySchool,
                    name: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.educationHistory.secondarySchool.city}
                    onChange={(e) => handleInputChange('educationHistory', 'secondarySchool', {
                      ...formData.educationHistory.secondarySchool,
                      city: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.educationHistory.secondarySchool.country}
                    onChange={(e) => handleInputChange('educationHistory', 'secondarySchool', {
                      ...formData.educationHistory.secondarySchool,
                      country: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium mb-2">When did you start?</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Month</label>
                    <select
                      value={formData.educationHistory.secondarySchool.startDate.month}
                      onChange={(e) => handleInputChange('educationHistory', 'secondarySchool', {
                        ...formData.educationHistory.secondarySchool,
                        startDate: {
                          ...formData.educationHistory.secondarySchool.startDate,
                          month: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Month</option>
                      <option value="01">January</option>
                      <option value="02">February</option>
                      <option value="03">March</option>
                      <option value="04">April</option>
                      <option value="05">May</option>
                      <option value="06">June</option>
                      <option value="07">July</option>
                      <option value="08">August</option>
                      <option value="09">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Year</label>
                    <select
                      value={formData.educationHistory.secondarySchool.startDate.year}
                      onChange={(e) => handleInputChange('educationHistory', 'secondarySchool', {
                        ...formData.educationHistory.secondarySchool,
                        startDate: {
                          ...formData.educationHistory.secondarySchool.startDate,
                          year: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Year</option>
                      {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Graduation Date */}
              <div>
                <label className="block text-sm font-medium mb-2">When did / will you graduate?</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Month</label>
                    <select
                      value={formData.educationHistory.secondarySchool.graduationDate.month}
                      onChange={(e) => handleInputChange('educationHistory', 'secondarySchool', {
                        ...formData.educationHistory.secondarySchool,
                        graduationDate: {
                          ...formData.educationHistory.secondarySchool.graduationDate,
                          month: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Month</option>
                      <option value="01">January</option>
                      <option value="02">February</option>
                      <option value="03">March</option>
                      <option value="04">April</option>
                      <option value="05">May</option>
                      <option value="06">June</option>
                      <option value="07">July</option>
                      <option value="08">August</option>
                      <option value="09">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Year</label>
                    <select
                      value={formData.educationHistory.secondarySchool.graduationDate.year}
                      onChange={(e) => handleInputChange('educationHistory', 'secondarySchool', {
                        ...formData.educationHistory.secondarySchool,
                        graduationDate: {
                          ...formData.educationHistory.secondarySchool.graduationDate,
                          year: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Year</option>
                      {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Advanced Standing Credits */}
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Did you complete Advanced Standing Credits at this school?
                </h3>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="advancedStandingCredits"
                      value="yes"
                      checked={formData.educationHistory.secondarySchool.advancedStandingCredits}
                      onChange={(e) => handleInputChange('educationHistory', 'secondarySchool', {
                        ...formData.educationHistory.secondarySchool,
                        advancedStandingCredits: e.target.value === 'yes'
                      })}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="advancedStandingCredits"
                      value="no"
                      checked={!formData.educationHistory.secondarySchool.advancedStandingCredits}
                      onChange={(e) => handleInputChange('educationHistory', 'secondarySchool', {
                        ...formData.educationHistory.secondarySchool,
                        advancedStandingCredits: e.target.value === 'yes'
                      })}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* Other Schools Question */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Have you attended any other schools?</h3>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="otherSchools"
                    value="yes"
                    checked={formData.educationHistory.otherSchools}
                    onChange={(e) => handleInputChange('educationHistory', 'otherSchools', e.target.value === 'yes')}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="otherSchools"
                    value="no"
                    checked={!formData.educationHistory.otherSchools}
                    onChange={(e) => handleInputChange('educationHistory', 'otherSchools', e.target.value === 'yes')}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Post-Secondary School Question */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Have you attended any post-secondary schools?</h3>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="postSecondary"
                    value="yes"
                    checked={formData.educationHistory.postSecondary}
                    onChange={(e) => handleInputChange('educationHistory', 'postSecondary', e.target.value === 'yes')}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="postSecondary"
                    value="no"
                    checked={!formData.educationHistory.postSecondary}
                    onChange={(e) => handleInputChange('educationHistory', 'postSecondary', e.target.value === 'yes')}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {/* SAT/ACT Question */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Have you taken an SAT or ACT Exam?</h3>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="satAct"
                    value="yes"
                    checked={formData.educationHistory.satAct}
                    onChange={(e) => handleInputChange('educationHistory', 'satAct', e.target.value === 'yes')}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="satAct"
                    value="no"
                    checked={!formData.educationHistory.satAct}
                    onChange={(e) => handleInputChange('educationHistory', 'satAct', e.target.value === 'yes')}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Academic Gaps Question */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-2">
                Are there any gaps of 6 months or more in your academic record?
              </h3>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="academicGaps"
                    value="yes"
                    checked={formData.educationHistory.academicGaps}
                    onChange={(e) => handleInputChange('educationHistory', 'academicGaps', e.target.value === 'yes')}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="academicGaps"
                    value="no"
                    checked={!formData.educationHistory.academicGaps}
                    onChange={(e) => handleInputChange('educationHistory', 'academicGaps', e.target.value === 'yes')}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Documents & Transcripts</h2>

            {/* Initial Question */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Do you have any documents that you are ready to upload at this time?
              </h3>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasDocuments"
                    value="yes"
                    checked={formData.documents.hasDocuments}
                    onChange={(e) => handleInputChange('documents', 'hasDocuments', e.target.value === 'yes')}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasDocuments"
                    value="no"
                    checked={!formData.documents.hasDocuments}
                    onChange={(e) => handleInputChange('documents', 'hasDocuments', e.target.value === 'yes')}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Conditional Content Based on Selection */}
            {formData.documents.hasDocuments ? (
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-md">
                  <h4 className="text-green-800 font-medium mb-2">Great! Let's get started.</h4>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Please upload any of the following documents that you have ready
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-2">All transcripts, education, and advanced standing documents</h4>
                      <p className="text-sm text-gray-600">
                        Non-English transcripts must be certified and translated into English by a school official.
                        Please upload a transcript for each school attended.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium">English test score results (TOEFL, IELTS, etc.)</h4>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium">Copy of your passport</h4>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <input
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.pdf,.png,.docx"
                          onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          Choose files to upload
                        </label>
                        <p className="mt-2 text-sm text-gray-600">
                          Each file must be less than 25 MB and one of the following document types:
                        </p>
                        <div className="mt-2 text-sm text-gray-500">
                          .jpg, .jpeg, .pdf, .png, .docx
                        </div>
                      </div>
                    </div>

                    {/* Display Uploaded Files */}
                    {formData.documents.files.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Uploaded Files:</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {formData.documents.files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                  {file.type.includes('image') ? (
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt="thumbnail"
                                      className="w-8 h-8 object-cover"
                                    />
                                  ) : (
                                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium truncate">{file.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / 1024).toFixed(2)}KB
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  const newFiles = formData.documents.files.filter((_, i) => i !== index);
                                  handleInputChange('documents', 'files', newFiles);
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="text-blue-800 font-medium mb-2">No problem!</h4>
                <p className="text-blue-600">
                  You will have an opportunity to submit your documents at a later time. 
                  Upon completing your application, a counselor will be in touch to help 
                  you gather all of the required documents.
                </p>
              </div>
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Agreements & Declarations</h2>

            {/* Disciplinary History */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Disciplinary History</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Have you ever been subject to disciplinary action, or do you currently have a disciplinary charge pending by any educational institution for behavioral misconduct?
                  </label>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="disciplinaryAction"
                        value="no"
                        checked={!formData.agreements.disciplinaryAction}
                        onChange={(e) => handleInputChange('agreements', 'disciplinaryAction', e.target.value === 'yes')}
                        className="mr-2"
                      />
                      No
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="disciplinaryAction"
                        value="yes"
                        checked={formData.agreements.disciplinaryAction}
                        onChange={(e) => handleInputChange('agreements', 'disciplinaryAction', e.target.value === 'yes')}
                        className="mr-2"
                      />
                      Yes
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Have you ever been convicted of or charged with a criminal offense, or are you currently the subject of a criminal proceeding?
                  </label>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="criminalOffense"
                        value="no"
                        checked={!formData.agreements.criminalOffense}
                        onChange={(e) => handleInputChange('agreements', 'criminalOffense', e.target.value === 'yes')}
                        className="mr-2"
                      />
                      No
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="criminalOffense"
                        value="yes"
                        checked={formData.agreements.criminalOffense}
                        onChange={(e) => handleInputChange('agreements', 'criminalOffense', e.target.value === 'yes')}
                        className="mr-2"
                      />
                      Yes
                    </label>
                  </div>
                </div>

                <p className="text-sm text-gray-600 italic">
                  (An affirmative response to any of the above questions will not automatically prevent admission, but any omission or falsification is grounds for denial, recission of admission or expulsion. If new circumstances alter your status at your current school or in your community after you submit this information, you are required to notify the university or universities to which you applied as soon as possible.)
                </p>
              </div>
            </div>

            {/* Notice of Non-Discrimination */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notice of Non-Discrimination</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                <p>
                  Cleveland State University does not discriminate on the basis of race, sex (including sexual harassment, sexual violence, sexual assault, sexual exploitation, relationship violence, domestic abuse and stalking), pregnancy, religion, color, age, national origin, veteran and/or military status, genetic information, disability, sexual orientation, gender identity and/or expression, marital status or parental status, participation in protected activity (retaliation), and/or any other status protected by state or federal law.
                </p>
                <p className="mt-2">
                  "Discrimination" is negative or adverse treatment of an employee, student or other member of the university community based on any of the classifications listed above. Employees, students, applicants for admission or employment, or other participants in Cleveland State University programs or activities who believe they have been discriminated against are entitled to seek relief through the Office for Institutional Equity or Title IX Coordinator.
                </p>
                <p className="mt-2">
                  For more information please contact the Office for Institutional Equity at (216) 687-2223 (Voice) or via email, oie@csuohio.edu.
                </p>
              </div>
            </div>

            {/* Auto-Apply Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Auto-Apply</h3>
              <p className="text-sm text-gray-700">
                Shorelight offers a new service to increase the likelihood of acceptance to your desired program by automatically applying you to similar programs.
              </p>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Would you like to increase your chance of acceptance by automatically applying to similar programs?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="autoApply"
                      value="yes"
                      checked={formData.agreements.autoApply}
                      onChange={(e) => handleInputChange('agreements', 'autoApply', e.target.value === 'yes')}
                      className="mr-2"
                    />
                    Yes, I would like to auto-apply to more programs
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="autoApply"
                      value="no"
                      checked={!formData.agreements.autoApply}
                      onChange={(e) => handleInputChange('agreements', 'autoApply', e.target.value === 'yes')}
                      className="mr-2"
                    />
                    No, I am not interested at this time
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  * By consenting above, I agree that Shorelight may use my completed application to automatically submit my application to other Shorelight programs that I may be qualified for. I understand that while I maybe be eligible, I am not guaranteed admission and the final decision is at the university's discretion.
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  ** Shorelight Programs include Signature, Premium and Member Services and vary by School.
                </p>
              </div>
            </div>

            {/* Enrollment Contract */}
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.agreements.enrollmentContract}
                  onChange={(e) => handleInputChange('agreements', 'enrollmentContract', e.target.checked)}
                  className="mt-1 mr-2"
                />
                <label className="text-sm">
                  I have read and understand the published enrollment contract for the program(s) I have selected on my application, and understand that the most updated copy may be found here: 
                  <a href="#" className="text-blue-600 hover:underline ml-1">Enrollment Contract</a>
                </label>
              </div>
            </div>

            {/* Medical Insurance Requirement */}
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.agreements.medicalInsurance}
                  onChange={(e) => handleInputChange('agreements', 'medicalInsurance', e.target.checked)}
                  className="mt-1 mr-2"
                />
                <label className="text-sm">
                  I understand I will be required to purchase medical insurance for the full duration of any on-campus portion of my program upon my arrival in the United States.
                </label>
              </div>
            </div>

            {/* Declarations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Declarations</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <p className="text-sm text-gray-700">
                  I declare that the information I have supplied on this form is complete and correct. I understand that giving false or incomplete information may lead to the refusal of my application or cancellation of enrollment and/or loss of visa status. To the extent that I have authorized my agent or other third party to sign this form on my behalf, I agree that I am solely responsible for the information I have supplied, including the representation below that I have read and understand the published Enrollment Contract.
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                  <li>I have read and understand the published course information in the brochure or website, and I have sufficient information about Cleveland State University and Cleveland State Global to make an informed enrollment decision.</li>
                  <li>I give Cleveland State University and Cleveland State Global permission to obtain official records from any educational institution attended by me.</li>
                  <li>I understand that tuition and fees may change without notice. I accept responsibility for payment of all relevant tuition and fees, and I agree to abide by the Cleveland State Global refund policy.</li>
                  <li>I understand that living expenses in the United States may be higher than in my own country, and I confirm that I have the financial ability to meet these costs.</li>
                  <li>I have read and understand the published Enrollment Contract for Cleveland State University and understand that the most updated copy may be found at the program's website at http://global.csuohio.edu/enrollment-contract.</li>
                </ul>
              </div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.agreements.declarations}
                  onChange={(e) => handleInputChange('agreements', 'declarations', e.target.checked)}
                  className="mt-1 mr-2"
                />
                <label className="text-sm font-medium">
                  I accept the above declarations.
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src={universityData?.university?.logoUrl || "/api/placeholder/48/48"}
              alt="University Logo" 
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">
                {universityData?.university?.name}
              </h1>
              <div className="text-sm text-gray-600">{level}</div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-semibold text-blue-900">
              {level?.toUpperCase()} APPLICATION
            </h2>
            <p className="text-sm text-gray-600">{level} Direct Process</p>
          </div>
        </div>
      </div>

      {/* Existing Application Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">University Application</h1>
          <div className="mt-4 flex justify-between items-center">
            {[1, 2, 3, 4, 5].map((step) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`w-10 h-10 rounded-full ${
                  step === currentStep
                    ? 'bg-blue-600 text-white'
                    : step < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>

        {renderStep()}

        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Previous
            </button>
          )}
          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyNow;