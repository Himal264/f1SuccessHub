import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    questions: 0,
    universities: 0,
    roleRequests: 0,
    stories: 0,
    advisorInquiries: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Questions
            </Typography>
            <Typography variant="h4">
              {stats.questions}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Universities
            </Typography>
            <Typography variant="h4">
              {stats.universities}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Role Requests
            </Typography>
            <Typography variant="h4">
              {stats.roleRequests}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Stories
            </Typography>
            <Typography variant="h4">
              {stats.stories}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Advisor Inquiries
            </Typography>
            <Typography variant="h4">
              {stats.advisorInquiries}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
