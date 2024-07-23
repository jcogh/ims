import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement signup logic
    console.log('Signup submitted', { username, email, password });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Sign Up
      </Typography>
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
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Sign Up
      </Button>
    </Box>
  );
};

export default SignUp;
