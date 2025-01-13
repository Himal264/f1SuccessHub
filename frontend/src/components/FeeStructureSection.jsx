import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

const FeeStructureSection = ({ university }) => {
  const [selectedLevel, setSelectedLevel] = useState('undergraduate'); // State to track selected fee level

  // Fee data based on the selected level (undergraduate or graduate)
  const fees = university?.feeStructure?.[selectedLevel];
  
  // Calculate the total fees for the selected level
  const totalFees = (fees?.tuitionFee || 0) + (fees?.livingFee || 0) + (fees?.otherFees || 0);

  return (
    <section id="fees" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-6 h-6 text-blue-900" />
          <h2 className="text-2xl font-bold text-blue-900">Fee Structure</h2>
        </div>

        {/* Toggle buttons for selecting fee structure */}
        <div className="mb-6 flex gap-4">
          <button
            className={`px-6 py-2 rounded-lg ${selectedLevel === 'undergraduate' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-blue-900'}`}
            onClick={() => setSelectedLevel('undergraduate')}
          >
            Undergraduate
          </button>
          <button
            className={`px-6 py-2 rounded-lg ${selectedLevel === 'graduate' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-blue-900'}`}
            onClick={() => setSelectedLevel('graduate')}
          >
            Graduate
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-gray-600 mb-2">Tuition Fee</h3>
            <p className="text-2xl font-bold text-blue-900">
              ${fees?.tuitionFee?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Per Year</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-gray-600 mb-2">Living Expenses</h3>
            <p className="text-2xl font-bold text-blue-900">
              ${fees?.livingFee?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Per Year</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-gray-600 mb-2">Other Fees</h3>
            <p className="text-2xl font-bold text-blue-900">
              ${fees?.otherFees?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Per Year</p>
          </div>

          <div className="bg-blue-900 p-6 rounded-lg text-white">
            <h3 className="text-blue-100 mb-2">Total Cost</h3>
            <p className="text-2xl font-bold">
              ${totalFees.toLocaleString()}
            </p>
            <p className="text-sm text-blue-100">Per Year</p>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Application Fee</h3>
          <p className="text-2xl font-bold text-blue-900">
            ${university?.applicationFee?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">One-time fee</p>
        </div>
      </div>
    </section>
  );
};

export default FeeStructureSection;
