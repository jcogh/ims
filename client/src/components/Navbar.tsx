import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  // This is a placeholder. Replace with actual auth logic.
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    // This is a placeholder. Replace with actual logout logic.
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          IMS
        </Typography>
        {isAuthenticated ? (
          <Box>
            <Button color="inherit" component={RouterLink} to="/inventory">
              Inventory
            </Button>
            <Button color="inherit" component={RouterLink} to="/add-product">
              Add Product
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/signup">
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
