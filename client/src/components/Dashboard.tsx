import React from 'react';
import { Container, Typography, Box, Button, Paper, Grid } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Retrieve user data from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">Welcome, {user?.username || 'User'}!</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1">User Information</Typography>
                <Typography>Username: {user?.username}</Typography>
                <Typography>Role: {user?.role}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1">Quick Actions</Typography>
                <Button component={RouterLink} to="/inventory" variant="contained" color="primary" sx={{ mt: 1 }}>
                  View Inventory
                </Button>
                <Button component={RouterLink} to="/add-product" variant="contained" color="secondary" sx={{ mt: 1, ml: 1 }}>
                  Add Product
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
        <Box sx={{ mt: 3 }}>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
