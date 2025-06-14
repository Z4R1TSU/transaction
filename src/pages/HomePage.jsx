import React from 'react';
import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReceiptIcon from '@mui/icons-material/Receipt';

const HomePage = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Welcome to the University Trading Platform!
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Your one-stop destination for buying and selling goods within the university community.
        </Typography>
        <Button variant="contained" color="primary" size="large" component={RouterLink} to="/goods" sx={{ mr: 2 }}>
          Browse Goods
        </Button>
        <Button variant="outlined" color="secondary" size="large" component={RouterLink} to="/shops">
          Explore Shops
        </Button>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <ShoppingBasketIcon sx={{ fontSize: 60, color: 'primary.light', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Wide Variety of Goods</Typography>
            <Typography color="text.secondary">
              Find everything from textbooks and electronics to handmade crafts and services offered by fellow students and staff.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <StorefrontIcon sx={{ fontSize: 60, color: 'secondary.light', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Support Local Sellers</Typography>
            <Typography color="text.secondary">
              Discover unique items from campus entrepreneurs and support your university community.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <ReceiptIcon sx={{ fontSize: 60, color: 'success.light', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Easy & Secure Transactions</Typography>
            <Typography color="text.secondary">
              A safe and straightforward platform for all your buying and selling needs.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;