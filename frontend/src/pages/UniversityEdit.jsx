import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const UniversityEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useState(JSON.parse(localStorage.getItem('userInfo')));
  
  // Define article sections that can be updated
  const articleSections = [
    { id: 'undergraduatePrograms', name: 'Undergraduate Programs' },
    { id: 'graduatePrograms', name: 'Graduate Programs' },
    { id: 'scholarships', name: 'Scholarships' },
    { id: 'description', name: 'University Description' },
    { id: 'admissionRequirements', name: 'Admission Requirements' },
    { id: 'location', name: 'University Location' },
    { id: 'feeStructureUndergraduate', name: 'Undergraduate Fee Structure' },
    { id: 'feeStructureGraduate', name: 'Graduate Fee Structure' },
    { id: 'intake', name: 'Intake Information' }
  ];
  
  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/university/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const universityData = response.data.university;
        setUniversity(universityData);
        
        // Check permission for university role
        if (user && user.role === 'university') {
          const userUniversityName = user.universityInfo?.universityName;
          if (!userUniversityName) {
            toast.error("University name not found in your profile");
            navigate('/');
            return;
          }
          
          // Case-insensitive comparison with trim to remove extra spaces
          console.log("Comparing:", userUniversityName.toLowerCase().trim(), "with", universityData.name.toLowerCase().trim());
          if (userUniversityName.toLowerCase().trim() !== universityData.name.toLowerCase().trim()) {
            toast.error(`You only have permission to edit ${userUniversityName}`);
            navigate('/');
            return;
          }
        } else if (user && user.role !== 'F1SuccessHub Team') {
          // If user is neither university nor F1SuccessHub Team
          toast.error('You do not have permission to edit university information');
          navigate('/');
          return;
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching university:', err);
        setError('Failed to load university information');
        setLoading(false);
        toast.error('Failed to load university information: ' + err.message);
      }
    };
    
    // Check if user has appropriate role
    if (!user || (user.role !== 'university' && user.role !== 'F1SuccessHub Team')) {
      toast.error('You do not have permission to access this page');
      navigate('/');
      return;
    }
    
    fetchUniversity();
  }, [id, navigate, user]);
  
  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading university information...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-96 text-red-500">{error}</div>;
  }
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit {university?.name}</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Back
        </button>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          {university?.logoUrl && (
            <img 
              src={university.logoUrl} 
              alt={university.name} 
              className="w-16 h-16 object-contain mr-4" 
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">{university?.name}</h2>
            <p className="text-gray-600">{university?.location?.state}, {university?.location?.region}</p>
          </div>
        </div>
      </div>
      
      {/* Article Sections */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Update Article Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articleSections.map(section => (
            <div key={section.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-2">{section.name}</h3>
              <button
                onClick={() => navigate(`/university/${id}/article/${section.id}`)}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Edit Article
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Basic University Info - Only for F1SuccessHub Team */}
      {user.role === 'F1SuccessHub Team' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Update University Information</h2>
          <p className="text-gray-600 mb-4">As an F1SuccessHub Team member, you can update all university information.</p>
          
          <button
            onClick={() => navigate(`/admin/university/edit/${id}`)}
            className="py-2 px-4 bg-[#002349] text-white rounded hover:bg-[#00172d] transition-colors"
          >
            Edit Basic University Info
          </button>
        </div>
      )}
    </div>
  );
};

export default UniversityEdit;