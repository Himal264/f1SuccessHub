import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const UniversitySearch = () => {
  const [universities, setUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [programLevel, setProgramLevel] = useState('Undergraduate');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch('http://localhost:9000/api/university/list');
        const data = await response.json();
        setUniversities(data);
      } catch (error) {
        console.error('Error fetching universities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const handleUniversityClick = (id) => {
    navigate(`/university/${id}`);
  };

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif text-center mb-4">
          Find your perfect program
        </h1>
        <p className="text-center text-xl text-gray-600 mb-8">
          We offer thousands of university programs, serving every type of learner,
          across the US and beyond.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-3xl mx-auto">
          <select
            value={programLevel}
            onChange={(e) => setProgramLevel(e.target.value)}
            className="p-3 rounded-md border border-gray-300 flex-1 md:w-1/3"
          >
            <option value="Undergraduate">Undergraduate</option>
            <option value="Graduate">Graduate</option>
            <option value="Doctorate">Doctorate</option>
          </select>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search Area of Study"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pr-12 rounded-md border border-gray-300"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredUniversities.map((university) => (
            <div
              key={university._id}
              onClick={() => handleUniversityClick(university._id)}
              className="p-6 bg-white rounded-lg shadow-md cursor-pointer transform transition-transform hover:scale-105"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleUniversityClick(university._id);
                }
              }}
            >
              <div className="h-32 flex items-center justify-center mb-4">
                <img
                  src={university.logoUrl}
                  alt={`${university.name} logo`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-center font-medium">{university.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniversitySearch;