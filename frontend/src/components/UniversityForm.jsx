import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';

const UniversityForm = () => {
  const { formData, updateAcademic } = useForm();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const currentYear = new Date().getFullYear();

  // Available options
  const FIELD_OF_STUDY_OPTIONS = [
    'Engineering',
    'Humanities',
    'HealthSciences',
    'NaturalSciences',
    'Business',
    'ComputerScience',
    'SocialScience',
    'Education'
  ];

  const INTAKE_OPTIONS = [
    { type: 'season', values: ['Fall', 'Spring', 'Summer', 'Winter'] },
    { type: 'month', values: ['January', 'March', 'May', 'August', 'September', 'December'] }
  ];

  const PRIORITY_OPTIONS = [
    'School Ranking',
    'Quality of Teaching',
    'Safety',
    'Employability',
    'Diversity'
  ];

  const BUDGET_RANGES = [
    'Less than $10,000',
    'up to $20,000',
    'up to $30,000',
    'up to $40,000',
    '$40,000 or higher'
  ];

  const CITY_SIZE_OPTIONS = ["Small", "Medium", "Large", "Metropolitan"];


  // Test configurations
  const TEST_CONFIG = {
    undergraduate: {
      english: ['IELTS', 'TOEFL', 'PTE', 'Duolingo'],
      admission: ['SAT', 'ACT'],
      tests: {
        IELTS: { min: 1, max: 9 },
        TOEFL: { min: 1, max: 120 },
        PTE: { min: 1, max: 90 },
        Duolingo: { min: 1, max: 160 },
        SAT: { min: 400, max: 1600 },
        ACT: { min: 1, max: 36 }
      }
    },
    graduate: {
      english: ['IELTS', 'TOEFL', 'PTE', 'Duolingo'],
      admission: ['GRE', 'GMAT', 'MCAT', 'LSAT'],
      tests: {
        IELTS: { min: 1, max: 9 },
        TOEFL: { min: 1, max: 120 },
        PTE: { min: 1, max: 90 },
        Duolingo: { min: 1, max: 160 },
        GRE: { min: 260, max: 340 },
        GMAT: { min: 200, max: 800 },
        MCAT: { min: 472, max: 528 },
        LSAT: { min: 120, max: 180 }
      }
    }
  };

  // Generate intake options
  const generateIntakeOptions = () => {
    const options = [];
    for (let year = currentYear; year <= currentYear + 2; year++) {
      INTAKE_OPTIONS.forEach(typeGroup => {
        typeGroup.values.forEach(value => {
          options.push(`${year} ${value}`);
        });
      });
    }
    return options;
  };

  const [intakeOptions] = useState(generateIntakeOptions());

  useEffect(() => {
    // Reset test scores when study level changes
    updateAcademic({ 
      englishTest: { type: '', score: '' },
      admissionTest: { type: '', score: '' }
    });
  }, [formData.academic.studyLevel]);

  const validateForm = () => {
    const newErrors = {};
    const { academic } = formData;
    const { tests } = TEST_CONFIG[academic.studyLevel];

    // Field of Study validation
    if (!FIELD_OF_STUDY_OPTIONS.includes(academic.fieldOfStudy)) {
      newErrors.fieldOfStudy = 'Please select a valid field of study';
    }

    // GPA validation
    if (!academic.gpa || academic.gpa < 1 || academic.gpa > 4.0) {
      newErrors.gpa = 'Valid GPA between 1.0-4.0 is required';
    }

    // English test validation
    if (academic.englishTest.type && !academic.englishTest.score) {
      newErrors.englishScore = 'Test score is required';
    } else if (academic.englishTest.score) {
      const { min, max } = tests[academic.englishTest.type];
      if (academic.englishTest.score < min || academic.englishTest.score > max) {
        newErrors.englishScore = `Score must be between ${min}-${max}`;
      }
    }

    // Admission test validation
    if (academic.admissionTest.type && !academic.admissionTest.score) {
      newErrors.admissionScore = 'Test score is required';
    } else if (academic.admissionTest.score) {
      const { min, max } = tests[academic.admissionTest.type];
      if (academic.admissionTest.score < min || academic.admissionTest.score > max) {
        newErrors.admissionScore = `Score must be between ${min}-${max}`;
      }
    }

    // Priorities validation
    if (academic.priorities.length === 0) {
      newErrors.priorities = 'Please select at least one priority';
    } else if (academic.priorities.length > 3) {
      newErrors.priorities = 'Maximum 3 priorities can be selected';
    }

    // Add budget validation
    if (!formData.academic.budgetRange) {
      newErrors.budgetRange = 'Budget range is required';
    }

    // Add city size validation
    if (!formData.academic.citySizePreference) {
      newErrors.citySize = 'City size preference is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTestChange = (testType, field, value) => {
    updateAcademic({
      [testType]: { 
        ...formData.academic[testType], 
        [field]: value 
      }
    });
  };

  const handlePriorityChange = (priority) => {
    const current = formData.academic.priorities || [];
    const newPriorities = current.includes(priority) 
      ? current.filter(p => p !== priority)
      : current.length < 3 ? [...current, priority] : current;
    
    updateAcademic({ priorities: newPriorities });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) navigate('/contactform');
  };

  const currentConfig = TEST_CONFIG[formData.academic.studyLevel];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Academic Preferences</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Study Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Study Level:</label>
            <select
              value={formData.academic.studyLevel}
              onChange={e => updateAcademic({ studyLevel: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="undergraduate">Undergraduate</option>
              <option value="graduate">Graduate</option>
            </select>
          </div>

          {/* Field of Study */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Field of Study:</label>
            <select
              value={formData.academic.fieldOfStudy}
              onChange={e => updateAcademic({ fieldOfStudy: e.target.value })}
              className={`w-full p-2 border rounded-md ${errors.fieldOfStudy ? 'border-red-500' : ''}`}
            >
              <option value="">Select Field</option>
              {FIELD_OF_STUDY_OPTIONS.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
            {errors.fieldOfStudy && <p className="text-red-500 text-sm">{errors.fieldOfStudy}</p>}
          </div>
        </div>

        {/* GPA Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">GPA (1.0-4.0):</label>
          <input
            type="number"
            step="0.01"
            min="1.0"
            max="4.0"
            value={formData.academic.gpa || ''}
            onChange={e => updateAcademic({ gpa: e.target.value })}
            className={`w-full p-2 border rounded-md ${errors.gpa ? 'border-red-500' : ''}`}
          />
          {errors.gpa && <p className="text-red-500 text-sm">{errors.gpa}</p>}
        </div>

        {/* Tests Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* English Test */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">English Test:</label>
            <select
              value={formData.academic.englishTest.type}
              onChange={e => handleTestChange('englishTest', 'type', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select English Test</option>
              {currentConfig.english.map(test => (
                <option key={test} value={test}>{test}</option>
              ))}
            </select>
            {formData.academic.englishTest.type && (
              <input
                type="number"
                placeholder={`Score (${currentConfig.tests[formData.academic.englishTest.type].min}-${currentConfig.tests[formData.academic.englishTest.type].max})`}
                value={formData.academic.englishTest.score || ''}
                onChange={e => handleTestChange('englishTest', 'score', e.target.value)}
                className={`w-full p-2 border rounded-md ${errors.englishScore ? 'border-red-500' : ''}`}
              />
            )}
            {errors.englishScore && <p className="text-red-500 text-sm">{errors.englishScore}</p>}
          </div>

          {/* Admission Test */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Admission Test:</label>
            <select
              value={formData.academic.admissionTest.type}
              onChange={e => handleTestChange('admissionTest', 'type', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Admission Test</option>
              {currentConfig.admission.map(test => (
                <option key={test} value={test}>{test}</option>
              ))}
            </select>
            {formData.academic.admissionTest.type && (
              <input
                type="number"
                placeholder={`Score (${currentConfig.tests[formData.academic.admissionTest.type].min}-${currentConfig.tests[formData.academic.admissionTest.type].max})`}
                value={formData.academic.admissionTest.score || ''}
                onChange={e => handleTestChange('admissionTest', 'score', e.target.value)}
                className={`w-full p-2 border rounded-md ${errors.admissionScore ? 'border-red-500' : ''}`}
              />
            )}
            {errors.admissionScore && <p className="text-red-500 text-sm">{errors.admissionScore}</p>}
          </div>
        </div>

        {/* Intake Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Preferred Intake:</label>
          <select
            value={formData.academic.intake}
            onChange={e => updateAcademic({ intake: e.target.value })}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Intake Period</option>
            {intakeOptions.map(intake => (
              <option key={intake} value={intake}>{intake}</option>
            ))}
          </select>
        </div>

        {/* Priorities Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Priorities (Select up to 3):
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {PRIORITY_OPTIONS.map(priority => (
              <label key={priority} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.academic.priorities?.includes(priority)}
                  onChange={() => handlePriorityChange(priority)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                  disabled={
                    formData.academic.priorities?.length >= 3 &&
                    !formData.academic.priorities?.includes(priority)
                  }
                />
                <span className="text-gray-700">{priority}</span>
              </label>
            ))}
          </div>
          {errors.priorities && <p className="text-red-500 text-sm">{errors.priorities}</p>}
        </div>

        {/* City Size Preference */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Preferred City Size:</label>
        <select
          value={formData.academic.citySizePreference || ''}
          onChange={e => updateAcademic({ citySizePreference: e.target.value })}
          className={`w-full p-2 border rounded-md ${errors.citySize ? 'border-red-500' : ''}`}
        >
          <option value="">Select City Size</option>
          {CITY_SIZE_OPTIONS.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        {errors.citySize && <p className="text-red-500 text-sm">{errors.citySize}</p>}
      </div>

      {/* Budget Range */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Annual Budget:</label>
        <select
          value={formData.academic.budgetRange || ''}
          onChange={e => updateAcademic({ budgetRange: e.target.value })}
          className={`w-full p-2 border rounded-md ${errors.budgetRange ? 'border-red-500' : ''}`}
        >
          <option value="">Select Budget Range</option>
          {BUDGET_RANGES.map(range => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>
        {errors.budgetRange && <p className="text-red-500 text-sm">{errors.budgetRange}</p>}
      </div>


        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Next →
        </button>
      </form>
    </div>
  );
};

export default UniversityForm;