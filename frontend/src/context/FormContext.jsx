import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const FormContext = createContext();

// Toast notification component
const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } animate-slide-in`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
};

export function FormProvider({ children }) {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('universityFormData');
    const defaultData = {
      academic: {
        studyLevel: 'undergraduate',
        fieldOfStudy: '',
        gpa: 3.0,
        englishTest: { type: '', score: '' },
        admissionTest: { type: '', score: '' },
        intake: '',
        priorities: [],
        citySizePreference: '',
        budgetRange: '',
        termsAccepted: false
      },
      contact: {
        firstName: '',
        lastName: '',
        email: '',
        country: 'US',
        phone: '',
        message: ''
      }
    };

    if (saved) {
      const parsedSaved = JSON.parse(saved);
      // Migrate old contact data to new format
      if (parsedSaved.contact) {
        if (parsedSaved.contact.phoneNumber) {
          parsedSaved.contact.phone = `${parsedSaved.contact.countryCode || ''}${parsedSaved.contact.phoneNumber}`.trim();
        }
        delete parsedSaved.contact.countryCode;
        delete parsedSaved.contact.phoneNumber;
      }
      return { ...defaultData, ...parsedSaved };
    }
    
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem('universityFormData', JSON.stringify(formData));
  }, [formData]);

  const updateAcademic = (data) => {
    setFormData(prev => ({
      ...prev,
      academic: { ...prev.academic, ...data }
    }));
  };

  const updateContact = (data) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, ...data }
    }));
  };

  const submitApplication = async () => {
    try {
      const payload = {
        academic: {
          ...formData.academic,
          gpa: parseFloat(formData.academic.gpa),
          englishTest: {
            ...formData.academic.englishTest,
            score: formData.academic.englishTest.score ? parseInt(formData.academic.englishTest.score) : null
          },
          admissionTest: {
            ...formData.academic.admissionTest,
            score: formData.academic.admissionTest.score ? parseInt(formData.academic.admissionTest.score) : null
          }
        },
        contact: formData.contact
      };

      console.log('Submitting application with payload:', payload);

      const response = await axios.post('http://localhost:9000/api/match', payload);
      
      console.log('Submission successful. Response:', response.data);
      showToast('Application submitted successfully!', 'success');
      
      // Clear form data after successful submission
      localStorage.removeItem('universityFormData');
      
      return response.data;
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to submit application';
      showToast(errorMessage, 'error');
      throw error;
    }
  };

  return (
    <FormContext.Provider value={{ 
      formData, 
      updateAcademic, 
      updateContact, 
      submitApplication 
    }}>
      {children}
    </FormContext.Provider>
  );
}

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-in {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
`;
document.head.appendChild(style);

export const useForm = () => useContext(FormContext);