import React, { useState } from 'react';
import {  GraduationCap} from 'lucide-react';

const ProgramsSection = ({ university }) => {
  const [activeLevel, setActiveLevel] = useState('graduate');
  const programs = activeLevel === 'graduate' ? university?.graduatePrograms : university?.undergraduatePrograms;

  return (
    <section id="programs" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="w-6 h-6 text-blue-900" />
          <h2 className="text-2xl font-bold text-blue-900">Academic Programs</h2>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveLevel('graduate')}
            className={`px-4 py-2 rounded-md ${
              activeLevel === 'graduate' ? 'bg-blue-900 text-white' : 'bg-gray-100'
            }`}
          >
            Graduate Programs
          </button>
          <button
            onClick={() => setActiveLevel('undergraduate')}
            className={`px-4 py-2 rounded-md ${
              activeLevel === 'undergraduate' ? 'bg-blue-900 text-white' : 'bg-gray-100'
            }`}
          >
            Undergraduate Programs
          </button>
        </div>

        <p className="text-gray-600 mb-8">{programs?.description}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(programs?.programs || {}).map(([category, programList]) => (
            <div key={category} className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">{category}</h3>
              <ul className="space-y-2">
                {programList.map((program) => (
                  <li key={program} className="text-gray-600">{program}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default ProgramsSection