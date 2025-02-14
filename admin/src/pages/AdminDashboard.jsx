import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    universities: [],
    roleRequests: [],
    questions: [],
    totalUniversities: 0,
    pendingRoleRequests: 0,
    totalQuestions: 0,
    recentUpdates: [],
  });
  const [loading, setLoading] = useState(true);
  const [questionCategories, setQuestionCategories] = useState({});
  const [universityFeatures, setUniversityFeatures] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch universities with features
      const universitiesResponse = await axios.get(`${backendUrl}/api/university/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Calculate university features distribution
      const features = universitiesResponse.data.universities.reduce((acc, uni) => {
        if (uni.features) {
          uni.features.forEach(feature => {
            acc[feature] = (acc[feature] || 0) + 1;
          });
        }
        return acc;
      }, {});

      setUniversityFeatures(features);

      // Fetch role requests
      const roleRequestsResponse = await axios.get(`${backendUrl}/api/user/verification-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch questions
      const questionsResponse = await axios.get(`${backendUrl}/api/question/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Calculate question categories distribution
      const categories = questionsResponse.data.questions.reduce((acc, question) => {
        acc[question.type] = (acc[question.type] || 0) + 1;
        return acc;
      }, {});

      // Get recent updates (last 5 questions with timestamps)
      const recentUpdates = questionsResponse.data.questions
        .slice(0, 5)
        .map(q => ({
          ...q,
          updateType: 'question',
          timestamp: q.createdAt || new Date()
        }));

      setQuestionCategories(categories);

      setStats({
        universities: universitiesResponse.data.universities || [],
        roleRequests: roleRequestsResponse.data.data || [],
        questions: questionsResponse.data.questions || [],
        totalUniversities: universitiesResponse.data.universities?.length || 0,
        pendingRoleRequests: roleRequestsResponse.data.data?.length || 0,
        totalQuestions: questionsResponse.data.questions?.length || 0,
        recentUpdates,
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Universities Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Universities</h2>
            <span className="text-2xl font-bold text-blue-600">{stats.totalUniversities}</span>
          </div>
          <div className="space-y-2">
            {stats.universities.slice(0, 3).map((uni) => (
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
        </div>

        {/* Role Requests Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Role Requests</h2>
            <span className="text-2xl font-bold text-orange-600">{stats.pendingRoleRequests}</span>
          </div>
          <div className="space-y-2">
            {stats.roleRequests.slice(0, 3).map((request) => (
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
        </div>

        {/* Questions Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Questions</h2>
            <span className="text-2xl font-bold text-green-600">{stats.totalQuestions}</span>
          </div>
          <div className="space-y-2">
            {stats.questions.slice(0, 3).map((question) => (
              <div key={question._id} className="p-2 bg-gray-50 rounded">
                <p className="font-medium truncate">{question.question}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">{question.type}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Question Categories Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Question Categories</h3>
          <div className="space-y-3">
            {Object.entries(questionCategories).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#F37021]"></div>
                  <span className="capitalize">{category}</span>
                </div>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* University Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">University Features</h3>
          <div className="space-y-3">
            {Object.entries(universityFeatures).map(([feature, count]) => (
              <div key={feature} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="capitalize">{feature}</span>
                </div>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Updates */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Updates</h3>
          <div className="space-y-3">
            {stats.recentUpdates.map((update, index) => (
              <div key={update._id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm truncate">{update.question}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-xs px-2 py-1 bg-[#F37021] text-white rounded-full">
                        {update.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(update.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Question Management</h3>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/add'}
              className="w-full px-4 py-2 text-sm bg-[#F37021] text-white rounded hover:bg-[#e85d0a] transition-colors"
            >
              Add New Question
            </button>
            <button 
              onClick={() => window.location.href = '/list'}
              className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Manage Questions
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">University Management</h3>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/adduniversity'}
              className="w-full px-4 py-2 text-sm bg-[#F37021] text-white rounded hover:bg-[#e85d0a] transition-colors"
            >
              Add New University
            </button>
            <button 
              onClick={() => window.location.href = '/listuniverstiy'}
              className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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
