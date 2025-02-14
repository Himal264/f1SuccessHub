import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const ListUniversity = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/university/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUniversities(response.data.universities);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching universities');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this university?')) {
      try {
        await axios.delete(`${backendUrl}/api/university/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('University deleted successfully');
        fetchUniversities();
      } catch (error) {
        toast.error('Error deleting university');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Universities List</h1>
        <div className="text-gray-600">
          Total Universities: {universities.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Enrollment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acceptance Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {universities.map((university) => (
              <tr key={university._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {university.logoUrl && (
                      <img
                        src={university.logoUrl}
                        alt={university.name}
                        className="h-10 w-10 rounded-full mr-3"
                      />
                    )}
                    <div className="text-sm font-medium text-gray-900">
                      {university.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {university.location?.state}, {university.location?.region}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {university.totalEnrollment?.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {university.acceptancerate}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(university._id)}
                    className="text-red-600 hover:text-red-900 mr-4"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => window.location.href = `/edit-university/${university._id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {universities.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No universities found
        </div>
      )}
    </div>
  );
};

export default ListUniversity;