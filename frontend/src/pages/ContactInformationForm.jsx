import { useFormContext } from '../context/FormContext';
import { useNavigate } from 'react-router-dom';

const ContactInformationForm = () => {
  const { formData, updateFormData } = useFormContext();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update final user data in context
    updateFormData({
      user: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: {
          countryCode: formData.countryCode,
          number: formData.phoneNumber
        }
      },
      termsAccepted: formData.acceptMarketing
    });

    try {
      // Submit complete profile to your API
      const response = await fetch('/api/search-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit profile');
      }

      // Fetch university matches
      const matchesResponse = await fetch('/api/find-matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!matchesResponse.ok) {
        throw new Error('Failed to fetch matches');
      }

      const matches = await matchesResponse.json();
      
      // Navigate to results
      navigate('/', { state: { matches } });

    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        submit: 'Failed to submit form. Please try again.'
      });
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-2">FIRST NAME</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg ${
                errors.firstName ? "border-red-500" : "border-gray-300"
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
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg ${
                errors.lastName ? "border-red-500" : "border-gray-300"
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
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Your email address"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">COUNTRY</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              errors.country ? "border-red-500" : "border-gray-300"
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

        {/* Phone */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              INTERNATIONAL CODE
            </label>
            <input
              type="text"
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Your country code"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">PHONE</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Your phone number"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>
        </div>

        {/* Marketing Consent */}
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            name="acceptMarketing"
            checked={formData.acceptMarketing}
            onChange={handleChange}
            className="mt-1"
          />
          <label className="text-sm text-gray-600">
            Yes, I would like to receive news and information about Shorelight.
          </label>
        </div>

        <div className="text-sm text-gray-600 mt-4">
          Your phone number and email allow our admissions representatives to
          contact you to discuss your options. Your information is secure and
          will only be used by a representative to provide you with more
          details.
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-800"
          >
            <Link to="/universitysearchform">← Previous</Link>
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Link to="/">Submit →</Link>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactInformationForm;
