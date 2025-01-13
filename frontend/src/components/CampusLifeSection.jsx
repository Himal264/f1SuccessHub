import React, { useState } from 'react';
import {  Users} from 'lucide-react';

const CampusLifeSection = ({ university }) => {
  return (
    <section id="campus" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-6 h-6 text-blue-900" />
          <h2 className="text-2xl font-bold text-blue-900">Campus Life</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">University Scores</h3>
              {Object.entries(university?.scores || {}).map(([category, score]) => (
                <div key={category} className="mb-4 last:mb-0">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium">{score}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-900 rounded-full h-2"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Student Body</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Total Enrollment</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {university?.totalEnrollment?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">International Students</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {university?.internationalStudentPercentage}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Graduation Rate</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {university?.graduationrate}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampusLifeSection