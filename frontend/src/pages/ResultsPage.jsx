import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.matches) {
      setResults(location.state.matches);
    }
  }, [location]);

  return (
    <div className="results-container">
      <h2>Your University Matches</h2>
      <button onClick={() => navigate('/')}>New Search</button>
      
      <div className="results-grid">
        {results.map((result, index) => (
          <div key={result.universityId} className="university-card">
            <h3>#{index + 1} {result.universityName}</h3>
            <div className="match-score">
              <div className="score-bar" style={{ width: `${result.matchPercentage}%` }}>
                {result.matchPercentage}%
              </div>
            </div>
            
            <div className="details">
              <p>📚 Academic Fit: {result.breakdown.academic}%</p>
              <p>💵 Financial Fit: {result.breakdown.financial}%</p>
              <p>⭐ Preferences: {result.breakdown.preferences}%</p>
            </div>

            <div className="university-info">
              <p>📍 Location: {result.university.location.region}</p>
              <p>🏫 Acceptance Rate: {result.university.acceptancerate}%</p>
              <p>💰 Estimated Cost: ${result.university.feeStructure[result.studyLevel].tuitionFee}/year</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;