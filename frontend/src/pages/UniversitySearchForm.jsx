import { useFormContext } from "../context/FormContext";
import { useNavigate } from "react-router-dom";

const programs = [
  "Computer Science",
  "Business Administration",
  "Engineering",
  "Medicine",
  "Law",
  "Arts & Design",
  "Social Sciences",
  "Natural Sciences",
];

const englishTests = [
  { label: "IELTS", max: 9 },
  { label: "TOEFL", max: 120 },
  { label: "PTE", max: 90 },
  { label: "Duolingo", max: 160 },
];

const preferences = [
  "Campus Life",
  "Research Opportunities",
  "Internship Programs",
  "Location",
  "University Ranking",
  "Career Services",
];

const UniversitySearchForm = () => {
  const { formData, updateFormData } = useFormContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update the context with academic profile data
    updateFormData({
      academicProfile: {
        studyLevel: formData.studyLevel,
        fieldOfStudy: formData.fieldOfStudy,
        gpa: parseFloat(formData.gpa),
        englishTest: {
          type: formData.englishTest.type,
          score: parseFloat(formData.englishTest.score),
        },
      },
      preferences: {
        priorities: formData.preferences,
        budgetRange: formData.budget,
      },
    });

    navigate("/contactinformationform");
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

      <form className="space-y-8">
        {/* Study Level */}
        <div className="space-y-4">
          <label className="block text-lg font-medium">Study Level</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="studyLevel"
                value="undergraduate"
                checked={formData.studyLevel === "undergraduate"}
                onChange={handleChange}
                className="mr-2"
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
                className="mr-2"
              />
              Graduate
            </label>
          </div>
        </div>

        {/* Field of Study */}
        <div className="space-y-4">
          <label className="block text-lg font-medium">Area of Study</label>
          <div className="relative">
            <input
              type="text"
              name="fieldOfStudy"
              value={formData.fieldOfStudy}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg pr-10"
              placeholder="Search for a program..."
            />
            <span className="absolute right-3 top-3 text-gray-400">🔍</span>
          </div>
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
                onClick={() =>
                  setFormData((prev) => ({ ...prev, fieldOfStudy: program }))
                }
              >
                {program}
              </button>
            ))}
          </div>
        </div>

        {/* GPA Score */}
        <div className="space-y-4">
          <label className="block text-lg font-medium">GPA Score</label>
          <input
            type="number"
            name="gpa"
            value={formData.gpa}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="4.0"
            className="w-full p-3 border rounded-lg"
            placeholder="Enter your GPA (4.0 scale)"
          />
        </div>

        {/* English Test */}
        <div className="space-y-4">
          <label className="block text-lg font-medium">
            English Test Score
          </label>
          <div className="space-y-4">
            <select
              name="englishTest.type"
              value={formData.englishTest.type}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select a test</option>
              {englishTests.map((test) => (
                <option key={test.label} value={test.label}>
                  {test.label}
                </option>
              ))}
            </select>

            {formData.englishTest.type && (
              <input
                type="number"
                name="englishTest.score"
                value={formData.englishTest.score}
                onChange={handleChange}
                min="0"
                max={
                  englishTests.find(
                    (test) => test.label === formData.englishTest.type
                  )?.max
                }
                className="w-full p-3 border rounded-lg"
                placeholder={`Enter your ${
                  formData.englishTest.type
                } score (max: ${
                  englishTests.find(
                    (test) => test.label === formData.englishTest.type
                  )?.max
                })`}
              />
            )}
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <label className="block text-lg font-medium">
            Preferences (Select up to 3)
          </label>
          <div className="grid grid-cols-2 gap-4">
            {preferences.map((pref) => (
              <label key={pref} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.preferences.includes(pref)}
                  onChange={() => handlePreferenceChange(pref)}
                  disabled={
                    formData.preferences.length >= 3 &&
                    !formData.preferences.includes(pref)
                  }
                  className="mr-2"
                />
                {pref}
              </label>
            ))}
          </div>
        </div>

        {/* Budget Range */}
        <div className="space-y-4">
          <label className="block text-lg font-medium">
            Annual Tuition & Fees (USD)
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[
              "Less than $10,000",
              "up to $20,000",
              "up to $30,000",
              "up to $40,000",
              "$40,000 or higher",
            ].map((range) => (
              <label key={range} className="flex items-center">
                <input
                  type="radio"
                  name="budget"
                  value={range}
                  checked={formData.budget === range}
                  onChange={handleChange}
                  className="mr-2"
                />
                {range}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next →
        </button>
      </form>
    </div>
  );
};

export default UniversitySearchForm;
