import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { login } from '../services/api';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const response = await login(username, password);
      console.log('Login successful', response.data);
      // TODO: Handle successful login (e.g., store token, redirect to dashboard)
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error', err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        fullWidth
        margin="normal"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mb: 2 }}>
        Login
      </Button>
      <Box sx={{ mt: 2 }}>
        <Link href="/signup" variant="body2">
          Don't have an account? Sign Up
        </Link>
      </Box>
    </Box>
  );
};

export default Login;
