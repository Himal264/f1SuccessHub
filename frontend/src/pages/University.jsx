import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UniPageHero from '../components/UniPageHero';

const University = () => {
  const { id } = useParams();
  const [universityData, setUniversityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        setLoading(true);
        console.log('Fetching university ID:', id);

        const response = await fetch(`http://localhost:9000/api/university/${id}`);
        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        if (data) {
          setUniversityData(data);
        } else {
          throw new Error('Received data is empty');
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUniversityData();
    } else {
      console.error('Invalid ID');
    }
  }, [id]);

  console.log('Loading:', loading);
  console.log('Error:', error);
  console.log('University Data:', universityData);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!universityData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>No university data found</div>
      </div>
    );
  }

  return <UniPageHero universityData={universityData} />;
};

export default University;
