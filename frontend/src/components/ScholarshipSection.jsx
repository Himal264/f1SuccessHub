import React from "react";
import PropTypes from "prop-types";

const ScholarshipSection = ({ university }) => {
  const scholarships = university?.scholarships;

  if (!Array.isArray(scholarships)) {
    return (
      <section id="scholarships" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Available Scholarships
          </h2>
          <p className="text-red-600">Invalid data provided for scholarships.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="scholarships" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-blue-900">
            Available Scholarships
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {scholarships.length > 0 ? (
            scholarships.map((scholarship, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="font-semibold text-lg mb-4">
                  {scholarship.name}
                </h3>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Type: </span>
                  {scholarship.type}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Eligibility: </span>
                  {scholarship.eligibility}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Amount: </span>$
                  {scholarship.amount.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Duration: </span>
                  {scholarship.duration}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">
              No scholarships available at the moment.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

// PropTypes validation
ScholarshipSection.propTypes = {
  university: PropTypes.shape({
    scholarships: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        eligibility: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        duration: PropTypes.string.isRequired,
      })
    ),
  }),
};

// Default props for safety
ScholarshipSection.defaultProps = {
  university: {
    scholarships: [],
  },
};

export default ScholarshipSection;
