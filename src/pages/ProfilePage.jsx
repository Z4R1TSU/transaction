import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../services/userService'; // Assuming a function to get current user details
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business'; // For shop name if business user
import SchoolIcon from '@mui/icons-material/School'; // For student ID if common user
import EditIcon from '@mui/icons-material/Edit';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Placeholder for user ID - replace with actual user ID from context/auth
  // This should ideally come from a global state/context after login
  const userId = localStorage.getItem('userId'); 
  const userRole = localStorage.getItem('userRole'); // '0' for common, '1' for business

  const fetchUserProfile = useCallback(async () => {
    if (!userId) {
      setError('User not logged in. Please login to view your profile.');
      setLoading(false);
      // setTimeout(() => navigate('/login'), 2000);
      return;
    }
    setLoading(true);
    setError('');
    try {
      // The backend might have different endpoints or ways to fetch full user details
      // For now, we use getUserById, assuming it returns all necessary info
      const response = await getUserById(userId);
      if (response.data && response.data.code === 200) { // Adjust code based on actual API
        setUser(response.data.data); 
      } else {
        setError(response.data.message || 'Failed to load user profile.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching user profile.');
    }
    setLoading(false);
  }, [userId, navigate]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        {!userId && <Button onClick={() => navigate('/login')} sx={{mt:2}}>Go to Login</Button>}
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" align="center">User profile not found.</Typography>
      </Container>
    );
  }

  // Common user details might be in a nested object like user.commonUser
  // Business user details might be in user.businessUser
  // Adjust based on your actual data structure from getUserById
  const commonUserDetails = user.commonUserDTO;
  const businessUserDetails = user.businessUserDTO;

  return (
    <Container sx={{ py: 4 }} maxWidth="md">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 120, height: 120, margin: '0 auto', mb: 2, bgcolor: 'primary.main' }}>
              <AccountCircleIcon sx={{ fontSize: 80 }} />
            </Avatar>
            <Typography variant="h5">{user.username}</Typography>
            <Typography color="text.secondary">
              {userRole === '0' ? 'Common User' : userRole === '1' ? 'Business User' : 'User'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h6" gutterBottom>Account Information</Typography>
            <List>
              <ListItem>
                <ListItemIcon><EmailIcon /></ListItemIcon>
                <ListItemText primary="Email" secondary={user.email || 'Not provided'} />
              </ListItem>
              {userRole === '0' && commonUserDetails && (
                <>
                  <ListItem>
                    <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                    <ListItemText primary="Real Name" secondary={commonUserDetails.realName || 'Not provided'} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SchoolIcon /></ListItemIcon>
                    <ListItemText primary="Student/Faculty ID" secondary={commonUserDetails.studentId || 'Not provided'} />
                  </ListItem>
                </>
              )}
              {userRole === '1' && businessUserDetails && (
                <>
                  <ListItem>
                    <ListItemIcon><BusinessIcon /></ListItemIcon>
                    <ListItemText primary="Shop Name" secondary={businessUserDetails.shopName || 'Not provided'} />
                  </ListItem>
                  {/* Add more business-specific details here if available, e.g., shop UUID, level, status */}
                  {businessUserDetails.shopUUID && 
                    <ListItem>
                        <ListItemIcon><BusinessIcon color="action"/></ListItemIcon>
                        <ListItemText primary="Shop ID" secondary={businessUserDetails.shopUUID} />
                    </ListItem>
                  }
                </>
              )}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: 'right' }}>
              <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate('/profile/edit')}>
                Edit Profile
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;