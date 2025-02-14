import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    universities: [],
    roleRequests: [],
    totalUniversities: 0,
    pendingRoleRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch universities
      const universitiesResponse = await axios.get(`${backendUrl}/api/university/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch role requests
      const roleRequestsResponse = await axios.get(`${backendUrl}/api/user/verification-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats({
        universities: universitiesResponse.data.universities || [],
        roleRequests: roleRequestsResponse.data.data || [],
        totalUniversities: universitiesResponse.data.universities?.length || 0,
        pendingRoleRequests: roleRequestsResponse.data.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Universities Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Universities</h2>
            <span className="text-2xl font-bold text-blue-600">{stats.totalUniversities}</span>
          </div>
          <div className="space-y-2">
            {stats.universities.slice(0, 5).map((uni) => (
              <div key={uni._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  {uni.logoUrl && (
                    <img src={uni.logoUrl} alt={uni.name} className="w-8 h-8 rounded-full object-cover" />
                  )}
                  <span className="font-medium">{uni.name}</span>
                </div>
                <span className="text-sm text-gray-600">{uni.location?.state}</span>
              </div>
            ))}
          </div>
          {stats.totalUniversities > 5 && (
            <div className="mt-4 text-center text-sm text-blue-600">
              +{stats.totalUniversities - 5} more universities
            </div>
          )}
        </div>

        {/* Role Requests Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pending Role Requests</h2>
            <span className="text-2xl font-bold text-orange-600">{stats.pendingRoleRequests}</span>
          </div>
          <div className="space-y-2">
            {stats.roleRequests.slice(0, 5).map((request) => (
              <div key={request._id} className="p-2 bg-gray-50 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{request.name}</p>
                    <p className="text-sm text-gray-600">{request.email}</p>
                  </div>
                  <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                    {request.verificationRequest?.requestedRole}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {stats.pendingRoleRequests > 5 && (
            <div className="mt-4 text-center text-sm text-orange-600">
              +{stats.pendingRoleRequests - 5} more requests
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* University Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">University Distribution</h3>
          <div className="space-y-2">
            {Object.entries(
              stats.universities.reduce((acc, uni) => {
                const region = uni.location?.region || 'Unknown';
                acc[region] = (acc[region] || 0) + 1;
                return acc;
              }, {})
            ).map(([region, count]) => (
              <div key={region} className="flex justify-between items-center">
                <span>{region}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Role Request Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Role Request Types</h3>
          <div className="space-y-2">
            {Object.entries(
              stats.roleRequests.reduce((acc, request) => {
                const role = request.verificationRequest?.requestedRole || 'Unknown';
                acc[role] = (acc[role] || 0) + 1;
                return acc;
              }, {})
            ).map(([role, count]) => (
              <div key={role} className="flex justify-between items-center">
                <span className="capitalize">{role}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/adduniversity'}
              className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add New University
            </button>
            <button 
              onClick={() => window.location.href = '/rolerequest'}
              className="w-full px-4 py-2 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
            >
              Review Role Requests
            </button>
            <button 
              onClick={() => window.location.href = '/listuniverstiy'}
              className="w-full px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Manage Universities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
