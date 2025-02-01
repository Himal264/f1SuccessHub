import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const RelatedUniversities = ({ currentUniversity, searchProfileId }) => {
  const [relatedUniversities, setRelatedUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedUniversities = async () => {
      try {
        let universities;
        
        if (searchProfileId) {
          // If we have a search profile ID, use it to get personalized matches
          const response = await fetch(
            `http://localhost:9000/api/match/${searchProfileId}`
          );
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          universities = data.matches.map(match => ({
            ...match.university,
            matchPercentage: match.matchPercentage
          }));
        } else {
          // Fall back to regular related universities logic
          const response = await fetch(
            "http://localhost:9000/api/university/list"
          );
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          universities = getRelatedUniversities(
            currentUniversity,
            data.universities || []
          );
        }
        
        setRelatedUniversities(universities);
      } catch (error) {
        console.error("Error fetching universities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedUniversities();
  }, [currentUniversity, searchProfileId]);

  const getRelatedUniversities = (current, allUniversities) => {
    if (!current || !allUniversities?.length) return [];

    const currentRank = current.rankings?.usa || 0;
    const currentTuition = current.feeStructure?.undergraduate?.tuitionFee || 0;

    // Calculate similarity scores for each university
    const scoredUniversities = allUniversities
      .filter((uni) => uni._id !== current._id) // Exclude current university
      .map((uni) => {
        const uniRank = uni.rankings?.usa || 0;
        const uniTuition = uni.feeStructure?.undergraduate?.tuitionFee || 0;

        // Calculate rank and tuition differences as percentages
        const rankDiff =
          currentRank && uniRank
            ? Math.abs(uniRank - currentRank) / Math.max(currentRank, uniRank)
            : 1;

        const tuitionDiff =
          currentTuition && uniTuition
            ? Math.abs(uniTuition - currentTuition) /
              Math.max(currentTuition, uniTuition)
            : 1;

        // Use the better similarity score (lower is better)
        const similarityScore = Math.min(rankDiff, tuitionDiff);

        return {
          university: uni,
          score: similarityScore,
        };
      })
      .sort((a, b) => a.score - b.score) // Sort by similarity (lowest score first)
      .map((item) => item.university)
      .slice(0, 6); // Changed from 3 to 6

    return scoredUniversities;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-center text-gray-600">
          Loading related universities...
        </p>
      </div>
    );
  }

  if (relatedUniversities.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-400">
      <h2 className="text-3xl font-serif text-center mb-12">
        {searchProfileId ? "Best Matching Universities" : "More Related Universities"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedUniversities.map((university) => (
          <Link
            key={university._id}
            to={`/university/${university._id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-1">
                    {university.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {university.location?.name}, {university.location?.state}
                  </p>
                </div>
                <img
                  src={university.logoUrl || "/api/placeholder/48/48"}
                  alt={`${university.name} logo`}
                  className="w-12 h-12 object-contain"
                />
              </div>

              {university.rankings?.usa && (
                <p className="text-sm text-gray-600 mb-4">
                  #{university.rankings.usa} U.S. News Ranking
                </p>
              )}

              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Average Tuition</span>
                  <p className="font-medium">
                    $
                    {(
                      university.feeStructure?.undergraduate?.tuitionFee || 0
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Location Type</span>
                  <p className="font-medium capitalize">
                    {university.location?.citysize?.toLowerCase()} city
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">
                    Total Enrollment
                  </span>
                  <p className="font-medium">
                    {(university.totalEnrollment || 0).toLocaleString()}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Region</span>
                  <p className="font-medium">
                    {(university.location?.region || "").replace("US - ", "")}
                  </p>
                </div>
              </div>

              <div className="mt-6 w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
                <span>Learn more</span>
                <ChevronRight className="w-4 h-4" />
              </div>

              {/* Add match percentage if available */}
              {university.matchPercentage && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                  {university.matchPercentage}% Match
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedUniversities;
