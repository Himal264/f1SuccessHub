import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const UniversityManagement = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('userInfo')));
  
  useEffect(() => {
    // Check if user has F1SuccessHub Team role
    if (!user || user.role !== 'F1SuccessHub Team') {
      toast.error('You do not have permission to access this page');
      navigate('/');
      return;
    }
    
    // Fetch all universities for F1SuccessHub Team
    const fetchUniversities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/university/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.universities) {
          setUniversities(response.data.universities);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching universities:', err);
        setError('Failed to load universities');
        setLoading(false);
        toast.error('Failed to load universities');
      }
    };
    
    fetchUniversities();
  }, [navigate, user]);
  
  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading universities...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-96 text-red-500">{error}</div>;
  }
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Universities</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Back
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {universities.map(university => (
          <div key={university._id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-40 overflow-hidden bg-gray-100 flex items-center justify-center">
              {university.logoUrl ? (
                <img 
                  src={university.logoUrl} 
                  alt={university.name} 
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="text-gray-400 text-lg">No logo available</div>
              )}
            </div>
            
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{university.name}</h2>
              <p className="text-gray-600 mb-2">{university.location?.state}, {university.location?.region}</p>
              <p className="text-sm text-gray-500 mb-4">Programs: {university.undergraduatePrograms?.programs?.Engineering?.length || 0} Engineering, {university.undergraduatePrograms?.programs?.Business?.length || 0} Business</p>
              
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => navigate(`/university-edit/${university._id}`)}
                  className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Edit University
                </button>
                <button
                  onClick={() => navigate(`/university/${university._id}`)}
                  className="w-full py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {universities.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No universities found</p>
        </div>
      )}
    </div>
  );
};

export default UniversityManagement;