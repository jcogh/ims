import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';

import theme from './theme';
import Navbar from './components/Navbar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import InventoryPage from './components/InventoryPage';
import AddProductPage from './components/AddProductPage';
import EditProductPage from './components/EditProductPage';

// You might want to implement a proper auth check
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route 
                path="/inventory" 
                element={<PrivateRoute element={<InventoryPage />} />} 
              />
              <Route 
                path="/add-product" 
                element={<PrivateRoute element={<AddProductPage />} />} 
              />
              <Route 
                path="/edit-product/:id" 
                element={<PrivateRoute element={<EditProductPage />} />} 
              />
              <Route path="/" element={<Navigate to="/inventory" replace />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
