import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';

const countries = [
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'NP', name: 'Nepal', dialCode: '+977' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'UK', name: 'UK', dialCode: '+44' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  // Add more countries as needed
];

const ContactInformationForm = () => {
  const { formData, updateContact, submitApplication } = useForm();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCountry = countries.find(c => c.code === formData.contact.country) || countries[0];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.contact.email) newErrors.email = 'Email is required';
    if (!formData.contact.phone) newErrors.phone = 'Phone number is required';
    if (!formData.contact.message) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCountryChange = (e) => {
    const newCountryCode = e.target.value;
    const newCountry = countries.find(c => c.code === newCountryCode);
    const oldCountry = countries.find(c => c.code === formData.contact.country);
    
    let currentPhone = formData.contact.phone || '';
    
    // Replace old country code with new one if present
    if (currentPhone.startsWith(oldCountry.dialCode)) {
      currentPhone = currentPhone.replace(oldCountry.dialCode, newCountry.dialCode);
    } else {
      currentPhone = `${newCountry.dialCode}${currentPhone}`;
    }
    
    updateContact({
      country: newCountryCode,
      phone: currentPhone
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await submitApplication();
      if (result.success) {
        navigate('/results', { state: { matches: result.matches } });
      }
    } catch (error) {
      setErrors({ form: 'Submission failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">First Name:</label>
            <input
              type="text"
              value={formData.contact.firstName || ''}
              onChange={(e) => updateContact({ firstName: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Last Name:</label>
            <input
              type="text"
              value={formData.contact.lastName || ''}
              onChange={(e) => updateContact({ lastName: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            value={formData.contact.email || ''}
            onChange={(e) => updateContact({ email: e.target.value })}
            className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : ''}`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Phone Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Country:</label>
            <select
              value={formData.contact.country || 'US'}
              onChange={handleCountryChange}
              className="w-full p-2 border rounded-md"
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.dialCode})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone Number:</label>
            <input
              type="tel"
              value={formData.contact.phone || ''}
              onChange={(e) => updateContact({ phone: e.target.value })}
              className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="+977 1234567890"
              required
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Message:</label>
          <textarea
            value={formData.contact.message || ''}
            onChange={(e) => updateContact({ message: e.target.value })}
            className={`w-full p-2 border rounded-md h-32 ${errors.message ? 'border-red-500' : ''}`}
            placeholder="Enter your message..."
            required
          />
          {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
        </div>

        {/* Form Error */}
        {errors.form && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {errors.form}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 text-white rounded-md transition-colors ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Get My Matches'}
        </button>
      </form>
    </div>
  );
};

export default ContactInformationForm;