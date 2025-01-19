// useFormSubmissionManager.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useFormSubmissionManager = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    countryCode: "",
    phoneNumber: "",
    studyLevel: "",
    fieldOfStudy: "",
    gpa: "",
    englishTest: {
      type: "",
      score: ""
    },
    admissionTest: {
      type: "",
      score: ""
    },
    intake: "",
    preferences: [],
    budget: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Validate study level
    if (!formData.studyLevel) newErrors.studyLevel = 'Study level is required';
    
    // Validate field of study
    if (!formData.fieldOfStudy) newErrors.fieldOfStudy = 'Field of study is required';
    
    // Validate GPA
    if (!formData.gpa || formData.gpa < 0 || formData.gpa > 4.0) {
      newErrors.gpa = 'Valid GPA between 0 and 4.0 is required';
    }

    // Validate English test
    if (!formData.englishTest.type) {
      newErrors['englishTest.type'] = 'English test type is required';
    } else if (!formData.englishTest.score && formData.englishTest.score !== 0) {
      newErrors['englishTest.score'] = 'English test score is required';
    }

    // Validate preferences
    if (!formData.preferences || formData.preferences.length === 0) {
      newErrors.preferences = 'At least one preference is required';
    }

    // Validate budget
    if (!formData.budget) newErrors.budget = 'Budget range is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

    // Only validate the specific field that was blurred
    const fieldError = validateField(fieldName);
    if (fieldError) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldError
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateField = (fieldName) => {
    const value = fieldName.includes('.')
      ? formData[fieldName.split('.')[0]][fieldName.split('.')[1]]
      : formData[fieldName];

    switch (fieldName) {
      case 'studyLevel':
        return !value ? 'Study level is required' : '';
      case 'fieldOfStudy':
        return !value ? 'Field of study is required' : '';
      case 'gpa':
        return !value || value < 0 || value > 4.0 ? 'Valid GPA between 0 and 4.0 is required' : '';
      case 'englishTest.type':
        return !value ? 'English test type is required' : '';
      case 'englishTest.score':
        return formData.englishTest.type && (!value && value !== 0) ? 'English test score is required' : '';
      case 'preferences':
        return (!value || value.length === 0) ? 'At least one preference is required' : '';
      case 'budget':
        return !value ? 'Budget range is required' : '';
      default:
        return '';
    }
  };

  const updateFormData = (updates) => {
    setFormData(prev => {
      const updated = { ...prev };
      
      // Handle nested updates
      Object.entries(updates).forEach(([key, value]) => {
        if (key.includes('.')) {
          const [parent, child] = key.split('.');
          updated[parent] = {
            ...updated[parent],
            [child]: value
          };
        } else {
          updated[key] = value;
        }
      });

      localStorage.setItem('formData', JSON.stringify(updated));
      return updated;
    });
  };

  
  const hasRequiredFields = () => {
    return (
      formData.studyLevel &&
      formData.fieldOfStudy &&
      formData.gpa &&
      formData.englishTest?.type &&
      (formData.englishTest?.score || formData.englishTest?.score === 0) &&
      formData.preferences?.length > 0 &&
      formData.budget
    );
  };

  const submitApplication = async () => {
    if (!validateForm()) {
      return false;
    }
  
    setIsSubmitting(true);
    try {
      // Log the entire formData
      console.log("FormData to be sent:", formData);
  
      // Log each field in formData
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'object') {
          console.log(`Field "${key}" data:`, JSON.stringify(value, null, 2));
        } else {
          console.log(`Field "${key}" data:`, value);
        }
      });
  
      const response = await fetch('/api/application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Send the formData as JSON
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
  
      const result = await response.json();
      localStorage.setItem('applicationResult', JSON.stringify(result));
      localStorage.removeItem('formData');
      window.location.reload(); // Refresh the page after successful submission
      return true;
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit application. Please try again.'
      }));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    errors,
    touched,
    isSubmitting,
    updateFormData,
    handleBlur,
    validateForm,
    hasRequiredFields,
    submitApplication
  };
};

export default useFormSubmissionManager;