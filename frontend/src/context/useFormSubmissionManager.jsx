// useFormSubmissionManager.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useFormSubmissionManager = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('formData');
    return savedData ? JSON.parse(savedData) : {
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
    };
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Add contact information validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';

    // Existing academic validation
    if (!formData.studyLevel) newErrors.studyLevel = 'Study level is required';
    if (!formData.fieldOfStudy) newErrors.fieldOfStudy = 'Field of study is required';
    if (!formData.gpa || formData.gpa < 0 || formData.gpa > 4.0) {
      newErrors.gpa = 'Valid GPA between 0 and 4.0 is required';
    }
    if (!formData.englishTest.type) {
      newErrors['englishTest.type'] = 'English test type is required';
    }
    if (!formData.englishTest.score && formData.englishTest.score !== 0) {
      newErrors['englishTest.score'] = 'English test score is required';
    }
    if (!formData.preferences || formData.preferences.length === 0) {
      newErrors.preferences = 'At least one preference is required';
    }
    if (!formData.budget) newErrors.budget = 'Budget range is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

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
      case 'firstName':
        return !value ? 'First name is required' : '';
      case 'lastName':
        return !value ? 'Last name is required' : '';
      case 'email':
        return !value ? 'Email is required' : '';
      case 'country':
        return !value ? 'Country is required' : '';
      case 'phoneNumber':
        return !value ? 'Phone number is required' : '';
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
    return !!(
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.country &&
      formData.phoneNumber &&
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
      throw new Error('Form validation failed');
    }
  
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/application-submit/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            country: formData.country,
            countryCode: formData.countryCode,
            phoneNumber: formData.phoneNumber,
          },
          academicInfo: {
            studyLevel: formData.studyLevel,
            fieldOfStudy: formData.fieldOfStudy,
            gpa: formData.gpa,
            englishTest: formData.englishTest,
            admissionTest: formData.admissionTest,
            intake: formData.intake,
          },
          preferences: {
            priorities: formData.preferences,
            budget: formData.budget,
          },
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit application');
      }

      const result = await response.json();
      localStorage.removeItem('formData');
      return result;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
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