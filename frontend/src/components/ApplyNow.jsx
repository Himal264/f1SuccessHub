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
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      birthDate: {
        day: '',
        month: '',
        year: ''
      },
      birthCity: '',
      birthCountry: '',
      citizenshipCountry: '',
      studyArea: '',
      entranceTerm: '',
      referralSource: '',
      hasUsVisa: false,
      hasVisaDenial: false,
      i20Transfer: 'no',
      fundingSource: '',
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
        address: {
          street1: '',
          street2: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        },
      },
      visaTypes: '',
      i20EndDate: {
        day: '',
        month: '',
        year: ''
      },
      sponsorshipBody: '',
      usAddress: {
        street1: '',
        street2: '',
        city: '',
        state: '',
        zipCode: '',
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
        creditTypes: {
          aice: false,
          ap: false,
          asLevel: false,
          ib: false,
          other: false
        },
        postSecondary: false,
        postSecondarySchools: [{
          name: '',
          city: '',
          country: '',
          major: '',
          startDate: {
            month: '',
            year: ''
          },
          graduationDate: {
            month: '',
            year: ''
          }
        }],
        satAct: false,
        academicGaps: false,
        examDetails: {
          type: '',
          totalScore: '',
          date: {
            day: '',
            month: '',
            year: ''
          }
        },
        gapDetails: {
          studyingEnglish: {
            selected: false,
            startDate: {
              month: '',
              year: ''
            },
            endDate: {
              month: '',
              year: ''
            }
          },
          working: {
            selected: false,
            startDate: {
              month: '',
              year: ''
            },
            endDate: {
              month: '',
              year: ''
            }
          },
          other: {
            selected: false,
            description: '',
            startDate: {
              month: '',
              year: ''
            },
            endDate: {
              month: '',
              year: ''
            }
          }
        },
        satAct: false,
        examType: '',
        examScore: '',
        examDate: {
          day: '',
          month: '',
          year: ''
        },
      },
      additionalSchools: [], // Array to store additional schools
      otherSchools: false,
      postSecondary: false,
      postSecondarySchools: [{
        name: '',
        city: '',
        country: '',
        major: '',
        startDate: {
          month: '',
          year: ''
        },
        graduationDate: {
          month: '',
          year: ''
        }
      }],
      satAct: false,
      academicGaps: false,
      examDetails: {
        type: '',
        totalScore: '',
        date: {
          day: '',
          month: '',
          year: ''
        }
      },
      gapDetails: {
        studyingEnglish: {
          selected: false,
          startDate: {
            month: '',
            year: ''
          },
          endDate: {
            month: '',
            year: ''
          }
        },
        working: {
          selected: false,
          startDate: {
            month: '',
            year: ''
          },
          endDate: {
            month: '',
            year: ''
          }
        },
        other: {
          selected: false,
          description: '',
          startDate: {
            month: '',
            year: ''
          },
          endDate: {
            month: '',
            year: ''
          }
        }
      }
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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const COUNTRY_CODES = {
    'Nepal': '+977',
    'US': '+1',
    'UK': '+44',
    'India': '+91',
    // Add more countries and their codes as needed
  };

  const US_STATES = [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' },
  ];

  const COUNTRIES = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina',
    'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic',
    'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti',
    'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia',
    'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
    'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast',
    'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
    'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia',
    'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia',
    'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger',
    'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent', 'Samoa', 'San Marino', 'Sao Tome and Principe',
    'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
    'South Africa', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
    'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine',
    'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
    'Yemen', 'Zambia', 'Zimbabwe'
  ];

  const updatePhoneCountryCode = (country) => {
    const countryCode = COUNTRY_CODES[country] || '';
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        phone: {
          ...prev.personalInfo.phone,
          mobile: {
            ...prev.personalInfo.phone.mobile,
            countryCode: countryCode
          },
          home: {
            ...prev.personalInfo.phone.home,
            countryCode: countryCode
          }
        },
        emergencyContact: {
          ...prev.personalInfo.emergencyContact,
          phone: {
            ...prev.personalInfo.emergencyContact.phone,
            countryCode: countryCode
          }
        }
      }
    }));
  };

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
      const formDataWithFiles = new FormData();
      
      // Add the main application data as a JSON string
      formDataWithFiles.append('application', JSON.stringify(formData));
      
      // Add files if they exist
      if (formData.documents.files.length > 0) {
        formData.documents.files.forEach(file => {
          formDataWithFiles.append('documents', file); // 'documents' matches the field name in multer
        });
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/applications/submit`, {
        method: 'POST',
        body: formDataWithFiles, // Don't set Content-Type header - browser will set it with boundary
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
    // Check if both checkboxes are checked
    if (!termsAccepted || !marketingConsent) {
      alert('Please accept both the Terms of Use and marketing consent to continue');
      return;
    }
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
              alt="University Logo"
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
                It will take approximately 5-10 minutes to complete the application.
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
                You can exit and resume the application at a later time, by entering your email address below and submitting the verification code when prompted.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-gray-600">
                We understand the importance of trust and security, so your personal information is always safeguarded to industry best practices.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {/* Terms and Privacy Policy Checkbox */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                To learn how we protect your information, please review our{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Use</a> and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
            </div>

            {/* Marketing Consent Checkbox */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="marketing"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label htmlFor="marketing" className="text-sm text-gray-600">
                Stay on Course for US University Success! Get Personalized Support from Shorelight (with Your Privacy in Mind):
                Yes, I would like to receive commercial electronic information and offers from Shorelight (including emails, texts, and push notifications, which may be subject to fees charged by my wireless carrier), including information about Shorelight programs at other universities. You may unsubscribe at any time.
              </label>
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
            <div>
              <h2 className="text-2xl font-bold">Personal Information</h2>
              <p className="mt-2 text-gray-600">
                We will capture your contact information once you begin this form. We may reach out to best serve you through the application process.
              </p>
              <p className="mt-2 text-gray-600">
                Please enter all information so that it matches your passport, birth certificate or other legal government documentation.
              </p>
            </div>

            {/* Name & Email Address Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Name & Email Address</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First (Given) Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.firstName || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last (Family) Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.lastName || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.personalInfo.email || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
                <p className="mt-2 text-sm text-gray-600">
                  We must collect your email address in order to properly support you as you transition to on-campus, or enroll in a Live program. This email address may be used to complete important activities prior to program start.
                </p>
              </div>
            </div>

            {/* Birth & Citizenship Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Birth & Citizenship Information</h3>

              <div>
                <label className="block text-sm font-medium mb-2">Gender <span className="text-red-500">*</span></label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.personalInfo.gender === 'male'}
                      onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                      className="mr-2"
                      required
                    />
                    Male
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.personalInfo.gender === 'female'}
                      onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                      className="mr-2"
                    />
                    Female
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Day <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.personalInfo.birthDate?.day || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'birthDate', {
                      ...formData.personalInfo.birthDate,
                      day: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Day</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Month <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.personalInfo.birthDate?.month || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'birthDate', {
                      ...formData.personalInfo.birthDate,
                      month: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Month</option>
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                      'August', 'September', 'October', 'November', 'December'].map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.personalInfo.birthDate?.year || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'birthDate', {
                      ...formData.personalInfo.birthDate,
                      year: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Year</option>
                    {[...Array(30)].map((_, i) => {
                      const year = new Date().getFullYear() - 30 + i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Birth City, Town, or Village <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.birthCity || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'birthCity', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Country of Birth / Nationality <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.personalInfo.birthCountry || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'birthCountry', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="Nepal">Nepal</option>
                    {/* Add more countries as needed */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Country of Citizenship <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.personalInfo.citizenshipCountry || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'citizenshipCountry', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="Nepal">Nepal</option>
                    {/* Add more countries as needed */}
                  </select>
                </div>
              </div>
            </div>

            {/* Start Term / Area of Interest */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Start Term / Area of Interest</h3>
              <p className="text-sm text-gray-600">Please note that some starting terms may not be available for each major.</p>

              <div>
                <label className="block text-sm font-medium mb-1">
                  What would you like to study? <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.personalInfo.studyArea || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'studyArea', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Area of Study</option>
                  {/* Add study areas */}
                </select>
              </div>

              {/* Entrance Term Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Intended Entrance Term <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.personalInfo.entranceTerm || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'entranceTerm', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Term</option>
                  {universityData?.university?.intake
                    ?.filter(intake => {
                      // Filter out past intakes
                      const deadlineDate = new Date(intake.deadline);
                      const currentDate = new Date();
                      return deadlineDate > currentDate;
                    })
                    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                    .map((intake, index) => (
                      <option 
                        key={index} 
                        value={`${intake.month} ${intake.year}`}
                      >
                        {`${intake.month} ${intake.year}`}
                      </option>
                    ))
                  }
                </select>
                {(!universityData?.university?.intake || universityData.university.intake.length === 0) && (
                  <p className="mt-1 text-sm text-red-500">
                    No upcoming intakes available for this university
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  How did you hear about us? <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.personalInfo.referralSource || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'referralSource', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Source</option>
                  {/* Add referral sources */}
                </select>
              </div>
            </div>

            {/* Visa Processing and Financials */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Visa Processing and Financials</h3>

              {/* US Visa History */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Has your applicant ever held a US visa (e.g. for tourism or previous studies)?
                </label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hasUsVisa"
                      value="no"
                      checked={formData.personalInfo.hasUsVisa === false}
                      onChange={(e) => handleInputChange('personalInfo', 'hasUsVisa', e.target.value === 'yes')}
                      className="mr-2"
                    />
                    No
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hasUsVisa"
                      value="yes"
                      checked={formData.personalInfo.hasUsVisa === true}
                      onChange={(e) => handleInputChange('personalInfo', 'hasUsVisa', e.target.value === 'yes')}
                      className="mr-2"
                    />
                    Yes
                  </label>
                </div>

                {/* Conditional Visa Types Field */}
                {formData.personalInfo.hasUsVisa && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">
                      What type(s) of visas has your applicant been issued in the past? <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.personalInfo.visaTypes || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'visaTypes', e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Visa Type</option>
                      <option value="B1/B2">B1/B2</option>
                      <option value="Student (F, J, M)">Student (F, J, M)</option>
                      <option value="Other">Other visa including dependent (A, E, G, H, I, K, L, N, O, P, R, S, T, TN, U, V)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Visa Denial History */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Have you had a previous visa denial in the last 3 years, including non-student visa types? <span className="text-red-500">*</span>
                </label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hasVisaDenial"
                      value="yes"
                      checked={formData.personalInfo.hasVisaDenial === true}
                      onChange={(e) => handleInputChange('personalInfo', 'hasVisaDenial', e.target.value === 'yes')}
                      className="mr-2"
                      required
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hasVisaDenial"
                      value="no"
                      checked={formData.personalInfo.hasVisaDenial === false}
                      onChange={(e) => handleInputChange('personalInfo', 'hasVisaDenial', e.target.value === 'yes')}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* I-20 Transfer */}
              <div>
                <label className="block text-sm font-medium mb-2">Will you be transferring an I-20?</label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="i20Transfer"
                      value="no"
                      checked={formData.personalInfo.i20Transfer === 'no'}
                      onChange={(e) => handleInputChange('personalInfo', 'i20Transfer', e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="i20Transfer"
                      value="yes"
                      checked={formData.personalInfo.i20Transfer === 'yes'}
                      onChange={(e) => handleInputChange('personalInfo', 'i20Transfer', e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="i20Transfer"
                      value="yes-expired"
                      checked={formData.personalInfo.i20Transfer === 'yes-expired'}
                      onChange={(e) => handleInputChange('personalInfo', 'i20Transfer', e.target.value)}
                      className="mr-2"
                    />
                    Yes - Expired
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Select "Yes" only if you are currently studying on an F1 student visa in the United States and have been issued an I-20 document from your current institution within the United States. If Yes or Yes - Expired, please provide a copy with your application materials.
                </p>

                {/* Conditional I-20 End Date Fields */}
                {(formData.personalInfo.i20Transfer === 'yes' || formData.personalInfo.i20Transfer === 'yes-expired') && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        I-20 End Date - Day <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.personalInfo.i20EndDate?.day || ''}
                        onChange={(e) => handleInputChange('personalInfo', 'i20EndDate', {
                          ...formData.personalInfo.i20EndDate,
                          day: e.target.value
                        })}
                        className="w-full p-2 border rounded"
                        required
                      >
                        <option value="">Select Day</option>
                        {[...Array(31)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Month <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.personalInfo.i20EndDate?.month || ''}
                        onChange={(e) => handleInputChange('personalInfo', 'i20EndDate', {
                          ...formData.personalInfo.i20EndDate,
                          month: e.target.value
                        })}
                        className="w-full p-2 border rounded"
                        required
                      >
                        <option value="">Select Month</option>
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                          'August', 'September', 'October', 'November', 'December'].map((month) => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Year <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.personalInfo.i20EndDate?.year || ''}
                        onChange={(e) => handleInputChange('personalInfo', 'i20EndDate', {
                          ...formData.personalInfo.i20EndDate,
                          year: e.target.value
                        })}
                        className="w-full p-2 border rounded"
                        required
                      >
                        <option value="">Select Year</option>
                        {[...Array(5)].map((_, i) => {
                          const year = new Date().getFullYear() + i;
                          return <option key={year} value={year}>{year}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Funding Source */}
              <div>
                <label className="block text-sm font-medium mb-2">How do you plan to pay for your studies?</label>
                <div className="space-y-2">
                  {['Personal Funds', 'Family Funds', 'Government Sponsorship', 'Other Method of Funding', "Don't Know Yet"].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="fundingSource"
                        value={option}
                        checked={formData.personalInfo.fundingSource === option}
                        onChange={(e) => handleInputChange('personalInfo', 'fundingSource', e.target.value)}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {/* Conditional Sponsorship Body Field */}
                {formData.personalInfo.fundingSource === 'Government Sponsorship' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      Name of sponsorship body <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.sponsorshipBody || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'sponsorshipBody', e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Emergency Contact Information</h3>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Is the emergency contact's address the same as your home address?
                </label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="sameAsHome"
                      value="yes"
                      checked={formData.personalInfo.emergencyContact.sameAsHome === true}
                      onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                        ...formData.personalInfo.emergencyContact,
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
                      checked={formData.personalInfo.emergencyContact.sameAsHome === false}
                      onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                        ...formData.personalInfo.emergencyContact,
                        sameAsHome: e.target.value === 'yes'
                      })}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Conditional Address Fields */}
              {formData.personalInfo.emergencyContact.sameAsHome === false && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Street address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.emergencyContact.address?.street1 || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                        ...formData.personalInfo.emergencyContact,
                        address: {
                          ...formData.personalInfo.emergencyContact.address,
                          street1: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Street address line 2 (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.emergencyContact.address?.street2 || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                        ...formData.personalInfo.emergencyContact,
                        address: {
                          ...formData.personalInfo.emergencyContact.address,
                          street2: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.emergencyContact.address?.city || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                        ...formData.personalInfo.emergencyContact,
                        address: {
                          ...formData.personalInfo.emergencyContact.address,
                          city: e.target.value
                        }
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
                      value={formData.personalInfo.emergencyContact.address?.state || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                        ...formData.personalInfo.emergencyContact,
                        address: {
                          ...formData.personalInfo.emergencyContact.address,
                          state: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Postal code (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.emergencyContact.address?.postalCode || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                        ...formData.personalInfo.emergencyContact,
                        address: {
                          ...formData.personalInfo.emergencyContact.address,
                          postalCode: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.personalInfo.emergencyContact.address?.country || ''}
                      onChange={(e) => {
                        const country = e.target.value;
                        handleInputChange('personalInfo', 'emergencyContact', {
                          ...formData.personalInfo.emergencyContact,
                          address: {
                            ...formData.personalInfo.emergencyContact.address,
                            country: country
                          }
                        });
                        updatePhoneCountryCode(country);
                      }}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Country</option>
                      {Object.keys(COUNTRY_CODES).map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Phone Input with Auto Country Code */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1">
                    Country Code
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.emergencyContact.phone.countryCode}
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.personalInfo.emergencyContact.phone.number || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                      ...formData.personalInfo.emergencyContact,
                      phone: {
                        ...formData.personalInfo.emergencyContact.phone,
                        number: e.target.value
                      }
                    })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold">Contact Information</h2>
            </div>

            {/* Permanent Home Address Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Permanent Home Address (outside of United States)</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Home street address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.homeAddress.street1 || ''}
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
                  value={formData.personalInfo.homeAddress.street2 || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'homeAddress', {
                    ...formData.personalInfo.homeAddress,
                    street2: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.homeAddress.city || ''}
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
                  value={formData.personalInfo.homeAddress.state || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'homeAddress', {
                    ...formData.personalInfo.homeAddress,
                    state: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Postal code (optional)
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.homeAddress.postalCode || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'homeAddress', {
                    ...formData.personalInfo.homeAddress,
                    postalCode: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.personalInfo.homeAddress.country || ''}
                  onChange={(e) => {
                    const country = e.target.value;
                    handleInputChange('personalInfo', 'homeAddress', {
                      ...formData.personalInfo.homeAddress,
                      country: country
                    });
                    updatePhoneCountryCode(country);
                  }}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Country</option>
                  {Object.keys(COUNTRY_CODES).map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Living in US Question */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Are you currently living in the United States?
                </label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="livingInUS"
                      value="yes"
                      checked={formData.personalInfo.livingInUS === true}
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
                      checked={formData.personalInfo.livingInUS === false}
                      onChange={(e) => handleInputChange('personalInfo', 'livingInUS', e.target.value === 'yes')}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Conditional US Address Fields */}
              {formData.personalInfo.livingInUS && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Address in United States <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.usAddress?.street1 || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'usAddress', {
                        ...formData.personalInfo.usAddress,
                        street1: e.target.value
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Address in United States line 2 (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.usAddress?.street2 || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'usAddress', {
                        ...formData.personalInfo.usAddress,
                        street2: e.target.value
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.usAddress?.city || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'usAddress', {
                        ...formData.personalInfo.usAddress,
                        city: e.target.value
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.personalInfo.usAddress?.state || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'usAddress', {
                        ...formData.personalInfo.usAddress,
                        state: e.target.value
                      })}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select State</option>
                      {US_STATES.map(state => (
                        <option key={state.code} value={state.code}>{state.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.usAddress?.zipCode || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'usAddress', {
                        ...formData.personalInfo.usAddress,
                        zipCode: e.target.value
                      })}
                      className="w-full p-2 border rounded"
                      required
                      pattern="[0-9]{5}"
                      maxLength="5"
                      placeholder="12345"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Phone Numbers Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Phone Number</h3>
              
              {/* Mobile Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">Mobile phone</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium mb-1">
                      Country code
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.phone.mobile.countryCode}
                      className="w-full p-2 border rounded bg-gray-100"
                      disabled
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Phone number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.personalInfo.phone.mobile.number}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', {
                        ...formData.personalInfo.phone,
                        mobile: {
                          ...formData.personalInfo.phone.mobile,
                          number: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Home Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">Home phone (optional)</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium mb-1">
                      Country code (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.phone.home.countryCode}
                      className="w-full p-2 border rounded bg-gray-100"
                      disabled
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Phone number (optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.personalInfo.phone.home.number}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', {
                        ...formData.personalInfo.phone,
                        home: {
                          ...formData.personalInfo.phone.home,
                          number: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Emergency Contact Details</h3>
              
              {/* Emergency Contact Relationship Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.personalInfo.emergencyContact.relationship || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                    ...formData.personalInfo.emergencyContact,
                    relationship: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Relationship</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Grandfather">Grandfather</option>
                  <option value="Grandmother">Grandmother</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  First name of emergency contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.emergencyContact.firstName || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                    ...formData.personalInfo.emergencyContact,
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
                  value={formData.personalInfo.emergencyContact.lastName || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                    ...formData.personalInfo.emergencyContact,
                    lastName: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.personalInfo.emergencyContact.email || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                    ...formData.personalInfo.emergencyContact,
                    email: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* Emergency Contact Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">Emergency contact phone</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium mb-1">
                      Country code
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.emergencyContact.phone.countryCode}
                      className="w-full p-2 border rounded bg-gray-100"
                      disabled
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Phone number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.personalInfo.emergencyContact.phone.number}
                      onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                        ...formData.personalInfo.emergencyContact,
                        phone: {
                          ...formData.personalInfo.emergencyContact.phone,
                          number: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Same as Home Address Question */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Is the emergency contact's address the same as your home address?
                </label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="sameAsHome"
                      value="yes"
                      checked={formData.personalInfo.emergencyContact.sameAsHome === true}
                      onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                        ...formData.personalInfo.emergencyContact,
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
                      checked={formData.personalInfo.emergencyContact.sameAsHome === false}
                      onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                        ...formData.personalInfo.emergencyContact,
                        sameAsHome: e.target.value === 'yes'
                      })}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Conditional Emergency Contact Address */}
              {formData.personalInfo.emergencyContact.sameAsHome === false && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Street address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.emergencyContact.address?.street1 || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                        ...formData.personalInfo.emergencyContact,
                        address: {
                          ...formData.personalInfo.emergencyContact.address,
                          street1: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Street address line 2 (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.emergencyContact.address?.street2 || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                        ...formData.personalInfo.emergencyContact,
                        address: {
                          ...formData.personalInfo.emergencyContact.address,
                          street2: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.emergencyContact.address?.city || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                        ...formData.personalInfo.emergencyContact,
                        address: {
                          ...formData.personalInfo.emergencyContact.address,
                          city: e.target.value
                        }
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
                      value={formData.personalInfo.emergencyContact.address?.state || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                        ...formData.personalInfo.emergencyContact,
                        address: {
                          ...formData.personalInfo.emergencyContact.address,
                          state: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Postal code (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.emergencyContact.address?.postalCode || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', {
                        ...formData.personalInfo.emergencyContact,
                        address: {
                          ...formData.personalInfo.emergencyContact.address,
                          postalCode: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.personalInfo.emergencyContact.address?.country || ''}
                      onChange={(e) => {
                        const country = e.target.value;
                        handleInputChange('personalInfo', 'emergencyContact', {
                          ...formData.personalInfo.emergencyContact,
                          address: {
                            ...formData.personalInfo.emergencyContact.address,
                            country: country
                          }
                        });
                      }}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Country</option>
                      {Object.keys(COUNTRY_CODES).map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold">Education History</h2>
            </div>

            {/* Primary School Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Secondary / High School Details</h3>

              {/* School Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name of School <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.educationHistory.secondarySchool.name || ''}
                  onChange={(e) => handleInputChange('educationHistory', 'secondarySchool', {
                    ...formData.educationHistory.secondarySchool,
                    name: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.educationHistory.secondarySchool.city || ''}
                  onChange={(e) => handleInputChange('educationHistory', 'secondarySchool', {
                    ...formData.educationHistory.secondarySchool,
                    city: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.educationHistory.secondarySchool.country || ''}
                  onChange={(e) => handleInputChange('educationHistory', 'secondarySchool', {
                    ...formData.educationHistory.secondarySchool,
                    country: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Country</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  When did you start? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Month</label>
                    <select
                      value={formData.educationHistory.secondarySchool.startDate?.month || ''}
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
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                        'August', 'September', 'October', 'November', 'December'].map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <select
                      value={formData.educationHistory.secondarySchool.startDate?.year || ''}
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
                      {[...Array(20)].map((_, i) => {
                        const year = new Date().getFullYear() - 19 + i;
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {/* Graduation Date */}
              <div>
                <label className="block text-sm font-medium mb-2">When did / will you graduate?</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Month</label>
                    <select
                      value={formData.educationHistory.secondarySchool.graduationDate?.month || ''}
                      onChange={(e) => handleInputChange('educationHistory', 'secondarySchool', {
                        ...formData.educationHistory.secondarySchool,
                        graduationDate: {
                          ...formData.educationHistory.secondarySchool.graduationDate,
                          month: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Month</option>
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                        'August', 'September', 'October', 'November', 'December'].map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <select
                      value={formData.educationHistory.secondarySchool.graduationDate?.year || ''}
                      onChange={(e) => handleInputChange('educationHistory', 'secondarySchool', {
                        ...formData.educationHistory.secondarySchool,
                        graduationDate: {
                          ...formData.educationHistory.secondarySchool.graduationDate,
                          year: e.target.value
                        }
                      })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Year</option>
                      {[...Array(20)].map((_, i) => {
                        const year = new Date().getFullYear() - 15 + i;
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {/* Advanced Standing Credits */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Did you complete Advanced Standing Credits at this school?
                  </label>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="primarySchoolAdvancedStandingCredits"
                        value="yes"
                        checked={formData.educationHistory.secondarySchool.advancedStandingCredits === true}
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
                        name="primarySchoolAdvancedStandingCredits"
                        value="no"
                        checked={formData.educationHistory.secondarySchool.advancedStandingCredits === false}
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

                {/* Credit Types (shown when Advanced Standing Credits is Yes) */}
                {formData.educationHistory.secondarySchool.advancedStandingCredits && (
                  <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                    <label className="block text-sm font-medium mb-2">
                      Which Advanced Standing Credits did you complete?
                    </label>
                    {['aice', 'ap', 'asLevel', 'ib', 'other'].map((creditType) => (
                      <label key={creditType} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.educationHistory.secondarySchool.creditTypes?.[creditType] || false}
                          onChange={(e) => handleInputChange('educationHistory', 'secondarySchool', {
                            ...formData.educationHistory.secondarySchool,
                            creditTypes: {
                              ...formData.educationHistory.secondarySchool.creditTypes,
                              [creditType]: e.target.checked
                            }
                          })}
                          className="mr-2"
                        />
                        {creditType === 'aice' ? 'AICE Credit' :
                         creditType === 'ap' ? 'AP Credit' :
                         creditType === 'asLevel' ? 'AS/A Level Credit' :
                         creditType === 'ib' ? 'IB Credit' : 'Other Credit'}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Other Schools Question */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Have you attended any other schools?
                </label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="otherSchools"
                      value="yes"
                      checked={formData.educationHistory.otherSchools === true}
                      onChange={(e) => {
                        handleInputChange('educationHistory', 'otherSchools', e.target.value === 'yes');
                        if (e.target.value === 'yes' && formData.educationHistory.additionalSchools.length === 0) {
                          addSchool();
                        }
                      }}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="otherSchools"
                      value="no"
                      checked={formData.educationHistory.otherSchools === false}
                      onChange={(e) => handleInputChange('educationHistory', 'otherSchools', e.target.value === 'yes')}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Additional Schools */}
              {formData.educationHistory.otherSchools && formData.educationHistory.additionalSchools.map((school, index) => (
                <div key={index} className="space-y-6 mt-8 p-6 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold">School {index + 2} Details</h3>
                  
                  {/* School Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Name of School</label>
                    <input
                      type="text"
                      value={school.name}
                      onChange={(e) => {
                        const updatedSchools = [...formData.educationHistory.additionalSchools];
                        updatedSchools[index] = { ...school, name: e.target.value };
                        handleInputChange('educationHistory', 'additionalSchools', updatedSchools);
                      }}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      value={school.city}
                      onChange={(e) => {
                        const updatedSchools = [...formData.educationHistory.additionalSchools];
                        updatedSchools[index] = { ...school, city: e.target.value };
                        handleInputChange('educationHistory', 'additionalSchools', updatedSchools);
                      }}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <select
                      value={school.country}
                      onChange={(e) => {
                        const updatedSchools = [...formData.educationHistory.additionalSchools];
                        updatedSchools[index] = { ...school, country: e.target.value };
                        handleInputChange('educationHistory', 'additionalSchools', updatedSchools);
                      }}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Country</option>
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium mb-2">When did you start?</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Month</label>
                        <select
                          value={school.startDate?.month}
                          onChange={(e) => {
                            const updatedSchools = [...formData.educationHistory.additionalSchools];
                            updatedSchools[index] = {
                              ...school,
                              startDate: { ...school.startDate, month: e.target.value }
                            };
                            handleInputChange('educationHistory', 'additionalSchools', updatedSchools);
                          }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select Month</option>
                          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                            'August', 'September', 'October', 'November', 'December'].map((month) => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Year</label>
                        <select
                          value={school.startDate?.year}
                          onChange={(e) => {
                            const updatedSchools = [...formData.educationHistory.additionalSchools];
                            updatedSchools[index] = {
                              ...school,
                              startDate: { ...school.startDate, year: e.target.value }
                            };
                            handleInputChange('educationHistory', 'additionalSchools', updatedSchools);
                          }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select Year</option>
                          {[...Array(20)].map((_, i) => {
                            const year = new Date().getFullYear() - 19 + i;
                            return <option key={year} value={year}>{year}</option>;
                          })}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Graduation Date */}
                  <div>
                    <label className="block text-sm font-medium mb-2">When did / will you graduate?</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Month</label>
                        <select
                          value={school.graduationDate?.month}
                          onChange={(e) => {
                            const updatedSchools = [...formData.educationHistory.additionalSchools];
                            updatedSchools[index] = {
                              ...school,
                              graduationDate: { ...school.graduationDate, month: e.target.value }
                            };
                            handleInputChange('educationHistory', 'additionalSchools', updatedSchools);
                          }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select Month</option>
                          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                            'August', 'September', 'October', 'November', 'December'].map((month) => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Year</label>
                        <select
                          value={school.graduationDate?.year}
                          onChange={(e) => {
                            const updatedSchools = [...formData.educationHistory.additionalSchools];
                            updatedSchools[index] = {
                              ...school,
                              graduationDate: { ...school.graduationDate, year: e.target.value }
                            };
                            handleInputChange('educationHistory', 'additionalSchools', updatedSchools);
                          }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select Year</option>
                          {[...Array(20)].map((_, i) => {
                            const year = new Date().getFullYear() - 19 + i;
                            return <option key={year} value={year}>{year}</option>;
                          })}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Standing Credits */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Did you complete Advanced Standing Credits at this school?
                    </label>
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`advancedStandingCredits${index}`}
                          value="yes"
                          checked={school.advancedStandingCredits === true}
                          onChange={(e) => {
                            const updatedSchools = [...formData.educationHistory.additionalSchools];
                            updatedSchools[index] = {
                              ...school,
                              advancedStandingCredits: e.target.value === 'yes'
                            };
                            handleInputChange('educationHistory', 'additionalSchools', updatedSchools);
                          }}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`advancedStandingCredits${index}`}
                          value="no"
                          checked={school.advancedStandingCredits === false}
                          onChange={(e) => {
                            const updatedSchools = [...formData.educationHistory.additionalSchools];
                            updatedSchools[index] = {
                              ...school,
                              advancedStandingCredits: e.target.value === 'yes'
                            };
                            handleInputChange('educationHistory', 'additionalSchools', updatedSchools);
                          }}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  {/* Credit Types (shown when Advanced Standing Credits is Yes) */}
                  {school.advancedStandingCredits && (
                    <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                      <label className="block text-sm font-medium mb-2">
                        Which Advanced Standing Credits did you complete?
                      </label>
                      {['aice', 'ap', 'asLevel', 'ib', 'other'].map((creditType) => (
                        <label key={creditType} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={school.creditTypes?.[creditType] || false}
                            onChange={(e) => {
                              const updatedSchools = [...formData.educationHistory.additionalSchools];
                              updatedSchools[index] = {
                                ...school,
                                creditTypes: {
                                  ...school.creditTypes,
                                  [creditType]: e.target.checked
                                }
                              };
                              handleInputChange('educationHistory', 'additionalSchools', updatedSchools);
                            }}
                            className="mr-2"
                          />
                          {creditType === 'aice' ? 'AICE Credit' :
                           creditType === 'ap' ? 'AP Credit' :
                           creditType === 'asLevel' ? 'AS/A Level Credit' :
                           creditType === 'ib' ? 'IB Credit' : 'Other Credit'}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Add Another School Button */}
              {formData.educationHistory.otherSchools && formData.educationHistory.additionalSchools.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    Have you attended any other schools?
                  </label>
                  <button
                    type="button"
                    onClick={addSchool}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add Another School
                  </button>
                </div>
              )}
            </div>

            {/* Post-Secondary Schools Section */}
            <div className="space-y-6 mt-8">
              <h3 className="text-lg font-semibold">Post-Secondary School Details</h3>
              
              {/* Initial Question */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Have you attended any post-secondary schools?
                </label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="postSecondary"
                      value="yes"
                      checked={formData.educationHistory.postSecondary === true}
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
                      checked={formData.educationHistory.postSecondary === false}
                      onChange={(e) => handleInputChange('educationHistory', 'postSecondary', e.target.value === 'yes')}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Post-Secondary School Details Form */}
              {formData.educationHistory.postSecondary && (
                <div className="space-y-6">
                  {formData.educationHistory.postSecondarySchools.map((school, index) => (
                    <div key={index} className="space-y-6 p-6 border rounded-lg bg-gray-50">
                      {/* School Name */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Name of School</label>
                        <input
                          type="text"
                          value={school.name}
                          onChange={(e) => {
                            const updatedSchools = [...formData.educationHistory.postSecondarySchools];
                            updatedSchools[index] = { ...school, name: e.target.value };
                            handleInputChange('educationHistory', 'postSecondarySchools', updatedSchools);
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <input
                          type="text"
                          value={school.city}
                          onChange={(e) => {
                            const updatedSchools = [...formData.educationHistory.postSecondarySchools];
                            updatedSchools[index] = { ...school, city: e.target.value };
                            handleInputChange('educationHistory', 'postSecondarySchools', updatedSchools);
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Country</label>
                        <select
                          value={school.country}
                          onChange={(e) => {
                            const updatedSchools = [...formData.educationHistory.postSecondarySchools];
                            updatedSchools[index] = { ...school, country: e.target.value };
                            handleInputChange('educationHistory', 'postSecondarySchools', updatedSchools);
                          }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select Country</option>
                          {COUNTRIES.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>

                      {/* Major */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Major</label>
                        <input
                          type="text"
                          value={school.major}
                          onChange={(e) => {
                            const updatedSchools = [...formData.educationHistory.postSecondarySchools];
                            updatedSchools[index] = { ...school, major: e.target.value };
                            handleInputChange('educationHistory', 'postSecondarySchools', updatedSchools);
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>

                      {/* Start Date */}
                      <div>
                        <label className="block text-sm font-medium mb-2">When did you start?</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Month</label>
                            <select
                              value={school.startDate?.month}
                              onChange={(e) => {
                                const updatedSchools = [...formData.educationHistory.postSecondarySchools];
                                updatedSchools[index] = {
                                  ...school,
                                  startDate: { ...school.startDate, month: e.target.value }
                                };
                                handleInputChange('educationHistory', 'postSecondarySchools', updatedSchools);
                              }}
                              className="w-full p-2 border rounded"
                            >
                              <option value="">Select Month</option>
                              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                                'August', 'September', 'October', 'November', 'December'].map((month) => (
                                <option key={month} value={month}>{month}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Year</label>
                            <select
                              value={school.startDate?.year}
                              onChange={(e) => {
                                const updatedSchools = [...formData.educationHistory.postSecondarySchools];
                                updatedSchools[index] = {
                                  ...school,
                                  startDate: { ...school.startDate, year: e.target.value }
                                };
                                handleInputChange('educationHistory', 'postSecondarySchools', updatedSchools);
                              }}
                              className="w-full p-2 border rounded"
                            >
                              <option value="">Select Year</option>
                              {[...Array(20)].map((_, i) => {
                                const year = new Date().getFullYear() - 19 + i;
                                return <option key={year} value={year}>{year}</option>;
                              })}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Graduation Date */}
                      <div>
                        <label className="block text-sm font-medium mb-2">When did / will you graduate?</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Month</label>
                            <select
                              value={school.graduationDate?.month}
                              onChange={(e) => {
                                const updatedSchools = [...formData.educationHistory.postSecondarySchools];
                                updatedSchools[index] = {
                                  ...school,
                                  graduationDate: { ...school.graduationDate, month: e.target.value }
                                };
                                handleInputChange('educationHistory', 'postSecondarySchools', updatedSchools);
                              }}
                              className="w-full p-2 border rounded"
                            >
                              <option value="">Select Month</option>
                              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                                'August', 'September', 'October', 'November', 'December'].map((month) => (
                                <option key={month} value={month}>{month}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Year</label>
                            <select
                              value={school.graduationDate?.year}
                              onChange={(e) => {
                                const updatedSchools = [...formData.educationHistory.postSecondarySchools];
                                updatedSchools[index] = {
                                  ...school,
                                  graduationDate: { ...school.graduationDate, year: e.target.value }
                                };
                                handleInputChange('educationHistory', 'postSecondarySchools', updatedSchools);
                              }}
                              className="w-full p-2 border rounded"
                            >
                              <option value="">Select Year</option>
                              {[...Array(20)].map((_, i) => {
                                const year = new Date().getFullYear() - 19 + i;
                                return <option key={year} value={year}>{year}</option>;
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Additional Schools Question */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">
                      Have you attended additional post-secondary schools?
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedSchools = [...formData.educationHistory.postSecondarySchools, {
                          name: '',
                          city: '',
                          country: '',
                          major: '',
                          startDate: { month: '', year: '' },
                          graduationDate: { month: '', year: '' }
                        }];
                        handleInputChange('educationHistory', 'postSecondarySchools', updatedSchools);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Add Another Post-Secondary School
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SAT/ACT Section */}
            <div className="space-y-6 mt-8">
              <h3 className="text-lg font-semibold">SAT / ACT Exam Results</h3>
              
              {/* Initial Question */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Have you taken an SAT or ACT Exam?
                </label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="satAct"
                      value="yes"
                      checked={formData.educationHistory.satAct === true}
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
                      checked={formData.educationHistory.satAct === false}
                      onChange={(e) => handleInputChange('educationHistory', 'satAct', e.target.value === 'yes')}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Exam Details (shown when Yes is selected) */}
              {formData.educationHistory.satAct && (
                <div className="space-y-6 p-6 border rounded-lg bg-gray-50">
                  {/* Exam Type Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Which exam did you take?
                    </label>
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="examType"
                          value="SAT"
                          checked={formData.educationHistory.examType === 'SAT'}
                          onChange={(e) => handleInputChange('educationHistory', 'examType', e.target.value)}
                          className="mr-2"
                        />
                        SAT
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="examType"
                          value="ACT"
                          checked={formData.educationHistory.examType === 'ACT'}
                          onChange={(e) => handleInputChange('educationHistory', 'examType', e.target.value)}
                          className="mr-2"
                        />
                        ACT
                      </label>
                    </div>
                  </div>

                  {/* Total Score */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Total Score</label>
                    <input
                      type="number"
                      value={formData.educationHistory.examScore || ''}
                      onChange={(e) => handleInputChange('educationHistory', 'examScore', e.target.value)}
                      className="w-full p-2 border rounded"
                      min={formData.educationHistory.examType === 'SAT' ? 400 : 1}
                      max={formData.educationHistory.examType === 'SAT' ? 1600 : 36}
                    />
                  </div>

                  {/* Exam Date */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Date the exam was taken</label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Day</label>
                        <select
                          value={formData.educationHistory.examDate?.day || ''}
                          onChange={(e) => handleInputChange('educationHistory', 'examDate', {
                            ...formData.educationHistory.examDate,
                            day: e.target.value
                          })}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select Day</option>
                          {[...Array(31)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Month</label>
                        <select
                          value={formData.educationHistory.examDate?.month || ''}
                          onChange={(e) => handleInputChange('educationHistory', 'examDate', {
                            ...formData.educationHistory.examDate,
                            month: e.target.value
                          })}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select Month</option>
                          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                            'August', 'September', 'October', 'November', 'December'].map((month) => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Year</label>
                        <select
                          value={formData.educationHistory.examDate?.year || ''}
                          onChange={(e) => handleInputChange('educationHistory', 'examDate', {
                            ...formData.educationHistory.examDate,
                            year: e.target.value
                          })}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select Year</option>
                          {[...Array(5)].map((_, i) => {
                            const year = new Date().getFullYear() - 4 + i;
                            return <option key={year} value={year}>{year}</option>;
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Academic Gaps Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Gaps in Your Academic Record</h3>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Are there any gaps of 6 months or more in your academic record?
                </label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="academicGaps"
                      value="yes"
                      checked={formData.educationHistory.academicGaps === true}
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
                      checked={formData.educationHistory.academicGaps === false}
                      onChange={(e) => handleInputChange('educationHistory', 'academicGaps', e.target.value === 'yes')}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Conditional fields when Academic Gaps is Yes */}
              {formData.educationHistory.academicGaps && (
                <div className="space-y-6 pl-4 border-l-2 border-gray-200">
                  <label className="block text-sm font-medium mb-2">
                    What have you been doing? (Select at least one. Check all that apply.)
                  </label>
                  
                  {/* Studying English Option */}
                  <div className="space-y-4">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.educationHistory.gapDetails?.studyingEnglish?.selected || false}
                        onChange={(e) => handleInputChange('educationHistory', 'gapDetails', {
                          ...formData.educationHistory.gapDetails,
                          studyingEnglish: {
                            ...formData.educationHistory.gapDetails?.studyingEnglish,
                            selected: e.target.checked
                          }
                        })}
                        className="mt-1"
                      />
                      <span>Studying English on my own</span>
                    </label>

                    {formData.educationHistory.gapDetails?.studyingEnglish?.selected && (
                      <div className="ml-8 space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">When did you start studying English?</label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Month</label>
                              <select
                                value={formData.educationHistory.gapDetails?.studyingEnglish?.startDate?.month || ''}
                                onChange={(e) => handleInputChange('educationHistory', 'gapDetails', {
                                  ...formData.educationHistory.gapDetails,
                                  studyingEnglish: {
                                    ...formData.educationHistory.gapDetails?.studyingEnglish,
                                    startDate: {
                                      ...formData.educationHistory.gapDetails?.studyingEnglish?.startDate,
                                      month: e.target.value
                                    }
                                  }
                                })}
                                className="w-full p-2 border rounded"
                                required
                              >
                                <option value="">Select Month</option>
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                                  'August', 'September', 'October', 'November', 'December'].map((month) => (
                                  <option key={month} value={month}>{month}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Year</label>
                              <select
                                value={formData.educationHistory.gapDetails?.studyingEnglish?.startDate?.year || ''}
                                onChange={(e) => handleInputChange('educationHistory', 'gapDetails', {
                                  ...formData.educationHistory.gapDetails,
                                  studyingEnglish: {
                                    ...formData.educationHistory.gapDetails?.studyingEnglish,
                                    startDate: {
                                      ...formData.educationHistory.gapDetails?.studyingEnglish?.startDate,
                                      year: e.target.value
                                    }
                                  }
                                })}
                                className="w-full p-2 border rounded"
                                required
                              >
                                <option value="">Select Year</option>
                                {[...Array(10)].map((_, i) => {
                                  const year = new Date().getFullYear() - i;
                                  return <option key={year} value={year}>{year}</option>;
                                })}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            When did you finish studying English? Or, if you are still studying, when will you finish?
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Month</label>
                              <select
                                value={formData.educationHistory.gapDetails?.studyingEnglish?.endDate?.month || ''}
                                onChange={(e) => handleInputChange('educationHistory', 'gapDetails', {
                                  ...formData.educationHistory.gapDetails,
                                  studyingEnglish: {
                                    ...formData.educationHistory.gapDetails?.studyingEnglish,
                                    endDate: {
                                      ...formData.educationHistory.gapDetails?.studyingEnglish?.endDate,
                                      month: e.target.value
                                    }
                                  }
                                })}
                                className="w-full p-2 border rounded"
                                required
                              >
                                <option value="">Select Month</option>
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                                  'August', 'September', 'October', 'November', 'December'].map((month) => (
                                  <option key={month} value={month}>{month}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Year</label>
                              <select
                                value={formData.educationHistory.gapDetails?.studyingEnglish?.endDate?.year || ''}
                                onChange={(e) => handleInputChange('educationHistory', 'gapDetails', {
                                  ...formData.educationHistory.gapDetails,
                                  studyingEnglish: {
                                    ...formData.educationHistory.gapDetails?.studyingEnglish,
                                    endDate: {
                                      ...formData.educationHistory.gapDetails?.studyingEnglish?.endDate,
                                      year: e.target.value
                                    }
                                  }
                                })}
                                className="w-full p-2 border rounded"
                                required
                              >
                                <option value="">Select Year</option>
                                {[...Array(10)].map((_, i) => {
                                  const year = new Date().getFullYear() + i;
                                  return <option key={year} value={year}>{year}</option>;
                                })}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Working Option */}
                  <div className="space-y-4">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.educationHistory.gapDetails?.working?.selected || false}
                        onChange={(e) => handleInputChange('educationHistory', 'gapDetails', {
                          ...formData.educationHistory.gapDetails,
                          working: {
                            ...formData.educationHistory.gapDetails?.working,
                            selected: e.target.checked
                          }
                        })}
                        className="mt-1"
                      />
                      <span>Working</span>
                    </label>

                    {formData.educationHistory.gapDetails?.working?.selected && (
                      <div className="ml-8 space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">When did you start working?</label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Month</label>
                              <select
                                value={formData.educationHistory.gapDetails?.working?.startDate?.month || ''}
                                onChange={(e) => handleInputChange('educationHistory', 'gapDetails', {
                                  ...formData.educationHistory.gapDetails,
                                  working: {
                                    ...formData.educationHistory.gapDetails?.working,
                                    startDate: {
                                      ...formData.educationHistory.gapDetails?.working?.startDate,
                                      month: e.target.value
                                    }
                                  }
                                })}
                                className="w-full p-2 border rounded"
                                required
                              >
                                <option value="">Select Month</option>
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                                  'August', 'September', 'October', 'November', 'December'].map((month) => (
                                  <option key={month} value={month}>{month}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Year</label>
                              <select
                                value={formData.educationHistory.gapDetails?.working?.startDate?.year || ''}
                                onChange={(e) => handleInputChange('educationHistory', 'gapDetails', {
                                  ...formData.educationHistory.gapDetails,
                                  working: {
                                    ...formData.educationHistory.gapDetails?.working,
                                    startDate: {
                                      ...formData.educationHistory.gapDetails?.working?.startDate,
                                      year: e.target.value
                                    }
                                  }
                                })}
                                className="w-full p-2 border rounded"
                                required
                              >
                                <option value="">Select Year</option>
                                {[...Array(10)].map((_, i) => {
                                  const year = new Date().getFullYear() - i;
                                  return <option key={year} value={year}>{year}</option>;
                                })}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            When did you finish working? Or, if you are still working, when will your employment end?
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Month</label>
                              <select
                                value={formData.educationHistory.gapDetails?.working?.endDate?.month || ''}
                                onChange={(e) => handleInputChange('educationHistory', 'gapDetails', {
                                  ...formData.educationHistory.gapDetails,
                                  working: {
                                    ...formData.educationHistory.gapDetails?.working,
                                    endDate: {
                                      ...formData.educationHistory.gapDetails?.working?.endDate,
                                      month: e.target.value
                                    }
                                  }
                                })}
                                className="w-full p-2 border rounded"
                                required
                              >
                                <option value="">Select Month</option>
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                                  'August', 'September', 'October', 'November', 'December'].map((month) => (
                                  <option key={month} value={month}>{month}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Year</label>
                              <select
                                value={formData.educationHistory.gapDetails?.working?.endDate?.year || ''}
                                onChange={(e) => handleInputChange('educationHistory', 'gapDetails', {
                                  ...formData.educationHistory.gapDetails,
                                  working: {
                                    ...formData.educationHistory.gapDetails?.working,
                                    endDate: {
                                      ...formData.educationHistory.gapDetails?.working?.endDate,
                                      year: e.target.value
                                    }
                                  }
                                })}
                                className="w-full p-2 border rounded"
                                required
                              >
                                <option value="">Select Year</option>
                                {[...Array(10)].map((_, i) => {
                                  const year = new Date().getFullYear() + i;
                                  return <option key={year} value={year}>{year}</option>;
                                })}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Other Option */}
                  <div className="space-y-4">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.educationHistory.gapDetails?.other?.selected || false}
                        onChange={(e) => handleInputChange('educationHistory', 'gapDetails', {
                          ...formData.educationHistory.gapDetails,
                          other: {
                            ...formData.educationHistory.gapDetails?.other,
                            selected: e.target.checked
                          }
                        })}
                        className="mt-1"
                      />
                      <span>Other</span>
                    </label>

                    {formData.educationHistory.gapDetails?.other?.selected && (
                      <div className="ml-8 space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">What were you doing during the academic gap?</label>
                          <textarea
                            value={formData.educationHistory.gapDetails?.other?.description || ''}
                            onChange={(e) => handleInputChange('educationHistory', 'gapDetails', {
                              ...formData.educationHistory.gapDetails,
                              other: {
                                ...formData.educationHistory.gapDetails?.other,
                                description: e.target.value
                              }
                            })}
                            className="w-full p-2 border rounded"
                            rows={3}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">When did you start?</label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Month</label>
                              <select
                                value={formData.educationHistory.gapDetails?.other?.startDate?.month || ''}
                                onChange={(e) => handleInputChange('educationHistory', 'gapDetails', {
                                  ...formData.educationHistory.gapDetails,
                                  other: {
                                    ...formData.educationHistory.gapDetails?.other,
                                    startDate: {
                                      ...formData.educationHistory.gapDetails?.other?.startDate,
                                      month: e.target.value
                                    }
                                  }
                                })}
                                className="w-full p-2 border rounded"
                                required
                              >
                                <option value="">Select Month</option>
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                                  'August', 'September', 'October', 'November', 'December'].map((month) => (
                                  <option key={month} value={month}>{month}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Year</label>
                              <select
                                value={formData.educationHistory.gapDetails?.other?.startDate?.year || ''}
                                onChange={(e) => handleInputChange('educationHistory', 'gapDetails', {
                                  ...formData.educationHistory.gapDetails,
                                  other: {
                                    ...formData.educationHistory.gapDetails?.other,
                                    startDate: {
                                      ...formData.educationHistory.gapDetails?.other?.startDate,
                                      year: e.target.value
                                    }
                                  }
                                })}
                                className="w-full p-2 border rounded"
                                required
                              >
                                <option value="">Select Year</option>
                                {[...Array(10)].map((_, i) => {
                                  const year = new Date().getFullYear() - i;
                                  return <option key={year} value={year}>{year}</option>;
                                })}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">When did / will you finish?</label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Month</label>
                              <select
                                value={formData.educationHistory.gapDetails?.other?.endDate?.month || ''}
                                onChange={(e) => handleInputChange('educationHistory', 'gapDetails', {
                                  ...formData.educationHistory.gapDetails,
                                  other: {
                                    ...formData.educationHistory.gapDetails?.other,
                                    endDate: {
                                      ...formData.educationHistory.gapDetails?.other?.endDate,
                                      month: e.target.value
                                    }
                                  }
                                })}
                                className="w-full p-2 border rounded"
                                required
                              >
                                <option value="">Select Month</option>
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                                  'August', 'September', 'October', 'November', 'December'].map((month) => (
                                  <option key={month} value={month}>{month}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Year</label>
                              <select
                                value={formData.educationHistory.gapDetails?.other?.endDate?.year || ''}
                                onChange={(e) => handleInputChange('educationHistory', 'gapDetails', {
                                  ...formData.educationHistory.gapDetails,
                                  other: {
                                    ...formData.educationHistory.gapDetails?.other,
                                    endDate: {
                                      ...formData.educationHistory.gapDetails?.other?.endDate,
                                      year: e.target.value
                                    }
                                  }
                                })}
                                className="w-full p-2 border rounded"
                                required
                              >
                                <option value="">Select Year</option>
                                {[...Array(10)].map((_, i) => {
                                  const year = new Date().getFullYear() + i;
                                  return <option key={year} value={year}>{year}</option>;
                                })}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                      <h4 className="font-medium mb-2"> All transcripts, education, and advanced standing documents</h4>
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

  // Add this function to handle adding new schools
  const addSchool = () => {
    setFormData(prev => ({
      ...prev,
      educationHistory: {
        ...prev.educationHistory,
        additionalSchools: [
          ...prev.educationHistory.additionalSchools,
          {
            name: '',
            city: '',
            country: '',
            startDate: {
              month: '',
              year: ''
            },
            graduationDate: {
              month: '',
              year: ''
            },
            advancedStandingCredits: false,
            creditTypes: {
              aice: false,
              ap: false,
              asLevel: false,
              ib: false,
              other: false
            }
          }
        ]
      }
    }));
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