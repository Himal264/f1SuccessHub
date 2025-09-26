import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { backendUrl } from '../App';

const Results = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Get searchProfileId from location state
        const searchProfileId = location.state?.searchProfileId;
        
        if (!searchProfileId) {
          throw new Error('No search profile ID found');
        }

        const response = await fetch(`${backendUrl}/api/match/${searchProfileId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch matches');
        }
        
        setMatches(data.matches || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching results:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [location]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-center text-gray-600">Loading university matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-center text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-center text-gray-600">No matching universities found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif text-center mb-8">Your University Matches</h1>
      <p className="text-center text-gray-600 mb-12">
        We found {matches.length} universities that match your preferences
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {matches.map((match) => (
          <Link
            key={match.universityId}
            to={`/university/${match.university._id}`}
            className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              {/* Match Percentage Badge */}
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {match.matchPercentage}% Match
              </div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-1">
                    {match.university.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {match.university.location?.name}, {match.university.location?.state}
                  </p>
                </div>
                <img
                  src={match.university.logoUrl || "/api/placeholder/48/48"}
                  alt={`${match.university.name} logo`}
                  className="w-12 h-12 object-contain"
                />
              </div>

              {/* Match Breakdown */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Match Breakdown:</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Academic Fit:</span>
                    <span>{match.breakdown.academic}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Financial Fit:</span>
                    <span>{match.breakdown.financial}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Preferences:</span>
                    <span>{match.breakdown.preferences}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {match.university.rankings?.usa && (
                  <div>
                    <span className="text-sm text-gray-600">U.S. News Ranking</span>
                    <p className="font-medium">#{match.university.rankings.usa}</p>
                  </div>
                )}

                <div>
                  <span className="text-sm text-gray-600">Annual Tuition</span>
                  <p className="font-medium">
                    ${(match.university.feeStructure?.undergraduate?.tuitionFee || 0).toLocaleString()}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Total Enrollment</span>
                  <p className="font-medium">
                    {(match.university.totalEnrollment || 0).toLocaleString()} students
                  </p>
                </div>
              </div>

              <div className="mt-6 w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
                <span>View Details</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Results;