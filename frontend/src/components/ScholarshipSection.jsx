import React from "react";

const ScholarshipSection = ({ scholarships }) => {
  return (
    <section id="scholarships" className="py-12 bg-gray-50">
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-blue-900">
            Available Scholarships
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {scholarships?.length > 0 ? (
            scholarships.map((scholarship, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-4">{scholarship.name}</h3>
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Type: </span>
                  {scholarship.type}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Eligibility: </span>
                  {scholarship.eligibility}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Amount: </span>
                  ${scholarship.amount.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Duration: </span>
                  {scholarship.duration}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No scholarships available at the moment.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ScholarshipSection;
