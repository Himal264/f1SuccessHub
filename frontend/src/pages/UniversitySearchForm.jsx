import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFormSubmissionManager from "../context/useFormSubmissionManager";

const programs = [
  "Engineering",
  "Humanities",
  "Medical and HealthSciences",
  "Natural Sciences",
  "Business",
  "Computer Science",
  "Social Sciences",
  "Education",
];

const englishTests = [
  { label: "IELTS", max: 9 },
  { label: "TOEFL", max: 120 },
  { label: "PTE", max: 90 },
  { label: "Duolingo", max: 160 },
];

const admissionTests = [
  { label: "GMAT", max: 800 },
  { label: "SAT", max: 1600 },
  { label: "GRE", max: 340 },
  { label: "ACT", max: 36 },
  { label: "MCAT", max: 528 },
  { label: "LSAT", max: 180 },
];

const intakes = [
  "January 2025",
  "February 2025",
  "March 2025",
  "April 2025",
  "May 2025",
  "June 2025",
  "July 2025",
  "August 2025",
  "September 2025",
  "October 2025",
  "November 2025",
  "December 2025",
];

const preferences = [
  "Safety",
  "Employment",
  "Diversity",
  "Quality of Teaching",
  "University Ranking",
];

const budgetRanges = [
  "Less than $10,000",
  "up to $20,000",
  "up to $30,000",
  "up to $40,000",
  "$40,000 or higher",
];

const UniversitySearchForm = () => {
  const {
    formData,
    errors,
    touched,
    updateFormData,
    handleBlur,
    validateForm,
  } = useFormSubmissionManager();

  const navigate = useNavigate();

  useEffect(() => {
    if (!Array.isArray(formData.preferences)) {
      updateFormData({ preferences: [] });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      navigate("/contactinformationform");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      updateFormData({
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      updateFormData({
        [name]: value,
      });
    }
    handleBlur(name);
  };

  const handleProgramSelect = (program) => {
    updateFormData({
      fieldOfStudy: program,
    });
    handleBlur("fieldOfStudy");
  };

  const handlePreferenceChange = (pref) => {
    const currentPrefs = formData.preferences || [];
    let newPrefs;

    if (currentPrefs.includes(pref)) {
      newPrefs = currentPrefs.filter((p) => p !== pref);
    } else if (currentPrefs.length < 3) {
      newPrefs = [...currentPrefs, pref];
    } else {
      return; // Don't update if already 3 selected
    }

    updateFormData({ preferences: newPrefs });
    handleBlur("preferences");
  };

  const getPreferences = () => {
    return formData.preferences || [];
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  // Check if form is valid for enabling/disabling submit button
  const hasRequiredFields = () => {
    return (
      formData.studyLevel &&
      formData.fieldOfStudy &&
      formData.gpa &&
      formData.englishTest?.type &&
      formData.englishTest?.score &&
      formData.preferences?.length > 0 &&
      formData.budget
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Perfect Program</h1>
        <p className="text-gray-600">
          Tell us about your academic history and goals so we can find the best
          university match for you!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Study Level */}
        <div className="space-y-4">
          <label className="block text-lg font-medium">
            Study Level <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="studyLevel"
                value="undergraduate"
                checked={formData.studyLevel === "undergraduate"}
                onChange={handleChange}
                onBlur={() => handleBlur("studyLevel")}
                className="mr-2"
                aria-invalid={!!getFieldError("studyLevel")}
              />
              Undergraduate
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="studyLevel"
                value="graduate"
                checked={formData.studyLevel === "graduate"}
                onChange={handleChange}
                onBlur={() => handleBlur("studyLevel")}
                className="mr-2"
                aria-invalid={!!getFieldError("studyLevel")}
              />
              Graduate
            </label>
          </div>
          {getFieldError("studyLevel") && (
            <p className="text-red-500 text-sm mt-1">{errors.studyLevel}</p>
          )}
        </div>

        {/* Field of Study */}
        <div className="space-y-4">
          <label className="block text-lg font-medium">
            Area of Study <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="fieldOfStudy"
              value={formData.fieldOfStudy || ""}
              onChange={handleChange}
              onBlur={() => handleBlur("fieldOfStudy")}
              className={`w-full p-3 border rounded-lg pr-10 ${
                getFieldError("fieldOfStudy")
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Search for a program..."
              aria-invalid={!!getFieldError("fieldOfStudy")}
            />
            <span className="absolute right-3 top-3 text-gray-400">🔍</span>
          </div>
          {getFieldError("fieldOfStudy") && (
            <p className="text-red-500 text-sm mt-1">{errors.fieldOfStudy}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {programs.map((program) => (
              <button
                key={program}
                type="button"
                className={`px-4 py-2 rounded-full border ${
                  formData.fieldOfStudy === program
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => handleProgramSelect(program)}
              >
                {program}
              </button>
            ))}
          </div>
        </div>

        {/* GPA Score */}
        <div className="space-y-4">
          <label className="block text-lg font-medium">
            GPA Score <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="gpa"
            value={formData.gpa || ""}
            onChange={handleChange}
            onBlur={() => handleBlur("gpa")}
            step="0.1"
            min="0"
            max="4.0"
            className={`w-full p-3 border rounded-lg ${
              getFieldError("gpa") ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your GPA (4.0 scale)"
            aria-invalid={!!getFieldError("gpa")}
          />
          {getFieldError("gpa") && (
            <p className="text-red-500 text-sm mt-1">{errors.gpa}</p>
          )}
        </div>

        {/* English Test */}
        <div className="space-y-4">
          <label className="block text-lg font-medium">
            English Test Score <span className="text-red-500">*</span>
          </label>
          <div className="space-y-4">
            <select
              name="englishTest.type"
              value={formData.englishTest?.type || ""}
              onChange={handleChange}
              onBlur={() => handleBlur("englishTest.type")}
              className={`w-full p-3 border rounded-lg ${
                getFieldError("englishTest.type")
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              aria-invalid={!!getFieldError("englishTest.type")}
            >
              <option value="">Select a test</option>
              {englishTests.map((test) => (
                <option key={test.label} value={test.label}>
                  {test.label}
                </option>
              ))}
            </select>

            {formData.englishTest?.type && (
              <input
                type="number"
                name="englishTest.score"
                value={formData.englishTest?.score || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("englishTest.score")}
                min="0"
                max={
                  englishTests.find(
                    (test) => test.label === formData.englishTest?.type
                  )?.max
                }
                className={`w-full p-3 border rounded-lg ${
                  getFieldError("englishTest.score")
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder={`Enter your ${
                  formData.englishTest.type
                } score (max: ${
                  englishTests.find(
                    (test) => test.label === formData.englishTest.type
                  )?.max
                })`}
                aria-invalid={!!getFieldError("englishTest.score")}
              />
            )}
            {getFieldError("englishTest.score") && (
              <p className="text-red-500 text-sm mt-1">
                {errors["englishTest.score"]}
              </p>
            )}
          </div>
        </div>

        {/* Admission Test */}
        <div className="space-y-4">
          <label className="block text-lg font-medium">
            Admission Test (Optional)
          </label>
          <div className="space-y-4">
            <select
              name="admissionTest.type"
              value={formData.admissionTest?.type || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select a test</option>
              {admissionTests.map((test) => (
                <option key={test.label} value={test.label}>
                  {test.label}
                </option>
              ))}
            </select>

            {formData.admissionTest?.type && (
              <input
                type="number"
                name="admissionTest.score"
                value={formData.admissionTest?.score || ""}
                onChange={handleChange}
                min="0"
                max={
                  admissionTests.find(
                    (test) => test.label === formData.admissionTest?.type
                  )?.max
                }
                className="w-full p-3 border rounded-lg"
                placeholder={`Enter your ${
                  formData.admissionTest.type
                } score (max: ${
                  admissionTests.find(
                    (test) => test.label === formData.admissionTest.type
                  )?.max
                })`}
              />
            )}
          </div>
        </div>

        {/* Intake */}
        <div className="space-y-4">
          <label className="block text-lg font-medium">Preferred Intake</label>
          <select
            name="intake"
            value={formData.intake || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select an intake</option>
            {intakes.map((intake) => (
              <option key={intake} value={intake}>
                {intake}
              </option>
            ))}
          </select>
        </div>

        {/* Update the preferences section to use getPreferences() */}
        <div className="grid grid-cols-2 gap-4">
          {preferences.map((pref) => (
            <label key={pref} className="flex items-center">
              <input
                type="checkbox"
                checked={getPreferences().includes(pref)}
                onChange={() => handlePreferenceChange(pref)}
                onBlur={() => handleBlur("preferences")}
                disabled={
                  getPreferences().length >= 3 &&
                  !getPreferences().includes(pref)
                }
                className="mr-2 h-4 w-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 checked:border-blue-500 checked:bg-blue-500"
                aria-invalid={!!getFieldError("preferences")}
              />
              {pref}
            </label>
          ))}
        </div>

        {/* Budget Range */}
        <div className="space-y-4">
          <label className="block text-lg font-medium">
            Annual Tuition & Fees (USD) <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            {budgetRanges.map((range) => (
              <label key={range} className="flex items-center">
                <input
                  type="radio"
                  name="budget"
                  value={range}
                  checked={formData.budget === range}
                  onChange={handleChange}
                  onBlur={() => handleBlur("budget")}
                  className="mr-2"
                  aria-invalid={!!getFieldError("budget")}
                />
                {range}
              </label>
            ))}
          </div>
          {getFieldError("budget") && (
            <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
          )}
        </div>

         {/* Updated submit button */}
         <button
          type="submit"
          disabled={!hasRequiredFields() || Object.keys(errors).length > 0}
          className={`w-full py-3 px-6 rounded-lg transition-colors ${
            !hasRequiredFields() || Object.keys(errors).length > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Next →
        </button>
      </form>
    </div>
  );
};

export default UniversitySearchForm;
