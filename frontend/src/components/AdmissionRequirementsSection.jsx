import React, { useState } from 'react';
import { Building2} from 'lucide-react';

const AdmissionRequirementsSection = ({ university }) => {
  const [activeLevel, setActiveLevel] = useState('graduate');
  const requirements = university?.admissionRequirements[activeLevel];

  return (
    <section id="admission" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="w-6 h-6 text-blue-900" />
          <h2 className="text-2xl font-bold text-blue-900">Admission Requirements</h2>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveLevel('graduate')}
            className={`px-4 py-2 rounded-md ${
              activeLevel === 'graduate' ? 'bg-blue-900 text-white' : 'bg-gray-100'
            }`}
          >
            Graduate
          </button>
          <button
            onClick={() => setActiveLevel('undergraduate')}
            className={`px-4 py-2 rounded-md ${
              activeLevel === 'undergraduate' ? 'bg-blue-900 text-white' : 'bg-gray-100'
            }`}
          >
            Undergraduate
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(requirements || {}).map(([test, score]) => (
            score && (
              <div key={test} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{test}</h3>
                <p className="text-2xl font-bold text-blue-900">{score}</p>
                <p className="text-sm text-gray-500">Minimum Required Score</p>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};


export default AdmissionRequirementsSection