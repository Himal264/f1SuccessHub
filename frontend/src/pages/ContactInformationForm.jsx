import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useFormSubmissionManager from '../context/useFormSubmissionManager';


const countries = [
  { code: 'NP', name: 'Nepal', intlCode: '+977' },
  { code: 'US', name: 'United States', intlCode: '+1' },
  { code: 'UK', name: 'United Kingdom', intlCode: '+44' },
  { code: 'CA', name: 'Canada', intlCode: '+1' },
  { code: 'AU', name: 'Australia', intlCode: '+61' },
];

const ContactInformationForm = () => {
  const {
    formData,
    errors,
    isSubmitting,
    updateFormData,
    handleBlur,
    submitApplication
  } = useFormSubmissionManager();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'country') {
      const selectedCountry = countries.find(c => c.code === value);
      updateFormData({
        country: value,
        countryCode: selectedCountry ? selectedCountry.intlCode : ''
      });
    } else {
      updateFormData({ [name]: value });
    }
    handleBlur(name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Format the data for submission
    const applicationData = {
      studentInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        country: formData.country,
        countryCode: formData.countryCode,
        phoneNumber: formData.phoneNumber
      },
      academicInfo: {
        studyLevel: formData.studyLevel,
        fieldOfStudy: formData.fieldOfStudy,
        gpa: formData.gpa,
        englishTest: formData.englishTest,
        admissionTest: formData.admissionTest,
        intake: formData.intake
      },
      preferences: {
        priorities: formData.preferences,
        budget: formData.budget
      }
    };

    const success = await submitApplication(applicationData);
    if (success) {
      navigate('/success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Tell us your contact information
        </h1>
        <p className="text-gray-600">
          Almost done! Share your contact information and we'll reveal the
          school recommendations that match closest with your profile.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Rest of the form JSX remains the same */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-2">FIRST NAME</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-2">LAST NAME</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">EMAIL</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Your email address"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium mb-2">COUNTRY</label>
          <select
            name="country"
            value={formData.country || ''}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              errors.country ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select your country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country}</p>
          )}
        </div>

        {/* International Code */}
        <div>
          <label className="block text-sm font-medium mb-2">
            INTERNATIONAL CODE
          </label>
          <input
            type="text"
            name="countryCode"
            value={formData.countryCode || ''}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
            placeholder="International code will appear here"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2">PHONE</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber || ''}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Your phone number"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-8">
          <Link
            to="/universitysearchform"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Previous
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isSubmitting ? 'Submitting...' : 'Submit →'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactInformationForm;