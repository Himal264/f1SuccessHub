import React from "react";

const AboutSection = ({ university }) => {
  return (
    <section id="about" className="py-12 bg-gray-50">
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-blue-900">
            About {university?.name}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={university?.logoUrl || "/path/to/default-logo.png"}
              alt={`${university?.name} logo`}
              className="w-full h-64 object-cover object-center rounded-lg mb-6"
            />
            <p className="text-lg text-gray-800 mb-6">
              {university?.description}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">
                University Rankings
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  World Ranking: {university?.rankings?.world || "N/A"}
                </p>
                <p className="text-gray-600">
                  USA Ranking: {university?.rankings?.usa || "N/A"}
                </p>
                <p className="text-gray-600">
                  State Ranking: {university?.rankings?.state || "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">
                University Statistics
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  Total Enrollment:{" "}
                  {university?.totalEnrollment?.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  International Student Percentage:{" "}
                  {university?.internationalStudentPercentage}%
                </p>
                <p className="text-gray-600">
                  Graduation Rate: {university?.graduationrate}%
                </p>
                <p className="text-gray-600">
                  Acceptance Rate: {university?.acceptancerate}%
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Full Year Tuition Fee</h3>
              <div className="space-y-2">
                {/* Display only Undergraduate Tuition Fee */}
                <p className="text-gray-600">
                  Tuition Fee (Undergraduate): $
                  {university?.feeStructure?.undergraduate?.tuitionFee?.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  Tuition Fee (graduate): $
                  {university?.feeStructure?.graduate?.tuitionFee?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
