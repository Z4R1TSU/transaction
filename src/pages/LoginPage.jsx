import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/userService'; // Assuming userService.js is in ../services
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('0'); // Default to '0' (Common User)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!username || !password) {
      setError('Username and password are required.');
      setLoading(false);
      return;
    }

    try {
      const userData = { username, password, role };
      const response = await loginUser(userData);
      // Assuming the backend returns a success message and user data upon successful login
      // And ResultMessage has a 'code' field (e.g., from an Enum like LOGIN_SUCCESS)
      // and a 'data' field for the user object.
      // You'll need to adjust this based on your actual backend ResultMessage structure.
      if (response && response.code === 2001) { // Assuming 2001 is LOGIN_SUCCESS code
        setSuccess(`Login successful! Welcome ${response.data?.username || 'user'}.`);
        // Store user info in context/local storage
        // For example: localStorage.setItem('user', JSON.stringify(response.data));
        // Redirect to a protected page or dashboard
        // navigate('/profile'); // Or wherever appropriate
      } else {
        setError(response.message || 'Login failed. Please check your credentials and role.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during login.');
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <FormControl fullWidth margin="normal" required disabled={loading}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="0">Common User</MenuItem>
              <MenuItem value="1">Business User</MenuItem>
              <MenuItem value="2">Admin</MenuItem> {/* Assuming '2' is for Admin based on UserController logic */}
            </Select>
          </FormControl>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
              {success}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          {/* Add links for registration or password recovery if needed */}
          {/* e.g., <Link href="/register" variant="body2">{"Don't have an account? Sign Up"}</Link> */}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;