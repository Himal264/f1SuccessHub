import React, { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

const UniPageHero = ({ universityData }) => {
  const [level, setLevel] = useState('Graduate');
  const [intake, setIntake] = useState(universityData?.intake[0] || 'Spring 2025');

  const monthsLeft = useMemo(() => {
    const targetDate = new Date('2025-05-01');
    const currentDate = new Date();
    const months = (targetDate.getFullYear() - currentDate.getFullYear()) * 12 + 
      (targetDate.getMonth() - currentDate.getMonth());
    return Math.max(0, months);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-blue-900">{universityData?.name}</h1>
            <img 
              src={universityData?.logoUrl || '/api/placeholder/48/48'} 
              alt="University Logo" 
              className="w-12 h-12 object-contain" 
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <select 
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="appearance-none bg-white border rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Graduate</option>
                <option>Undergraduate</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500" />
            </div>

            <div className="relative">
              <select 
                value={intake}
                onChange={(e) => setIntake(e.target.value)}
                className="appearance-none bg-white border rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {universityData?.intake.map(term => (
                  <option key={term}>{term}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500" />
            </div>
          </div>

          <p className="text-gray-600 max-w-2xl">
            {universityData?.description}
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-900">#{universityData?.rankings.world}</div>
              <div className="text-sm text-gray-600">World Ranking</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-900">#{universityData?.rankings.usa}</div>
              <div className="text-sm text-gray-600">USA Ranking</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-900">#{universityData?.rankings.state}</div>
              <div className="text-sm text-gray-600">State Ranking</div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-900">
              There are <span className="font-bold">{monthsLeft} months</span> left to apply for Summer 2025
            </p>
          </div>

          <div className="space-y-2">
            <button className="w-full bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors">
              Apply Now
            </button>
            <button className="w-full bg-white border border-blue-900 text-blue-900 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors">
              Ask an Advisor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniPageHero;