import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const NotFoundPage = () => {
  return (
    <Container sx={{ py: 8, textAlign: 'center' }}>
      <Box sx={{ mb: 4 }}>
        <SentimentVeryDissatisfiedIcon sx={{ fontSize: 100, color: 'text.secondary' }} />
      </Box>
      <Typography variant="h3" component="h1" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </Typography>
      <Button variant="contained" color="primary" component={RouterLink} to="/">
        Go to Homepage
      </Button>
    </Container>
  );
};

export default NotFoundPage;