import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealFilter, getDealCount } from '../services/dealService';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Grid,
  Pagination,
  Chip
} from '@mui/material';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  const navigate = useNavigate();

  // Placeholder for user ID - replace with actual user ID from context/auth
  const userId = localStorage.getItem('userId') || 'temp-user-id'; // Or get from auth context

  const fetchOrders = useCallback(async () => {
    if (!userId) {
      setError('User not logged in. Please login to view your orders.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Filter deals by commonId (user's ID) to get their orders
      // You might need to adjust the filter object based on your backend's expectations for 'dealFilter'
      const filterCriteria = { commonId: userId }; 
      const response = await dealFilter(filterCriteria, currentPage, pageSize);
      if (response.data && response.data.code === 200) {
        setOrders(response.data.data || []);
        const countResponse = await getDealCount(filterCriteria);
        if (countResponse.data && countResponse.data.code === 200) {
          setTotalPages(Math.ceil(countResponse.data.data / pageSize));
        } else {
          setTotalPages(0);
        }
      } else {
        setOrders([]);
        setTotalPages(0);
        setError(response.data.message || 'Failed to load orders.');
      }
    } catch (err) {
      setOrders([]);
      setTotalPages(0);
      setError(err.message || 'An error occurred while fetching orders.');
    }
    setLoading(false);
  }, [userId, currentPage, pageSize]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getStatusChip = (status) => {
    // Example status mapping, adjust based on your backend's status codes/values
    switch (status) {
      case '0': return <Chip label="Pending Payment" color="warning" size="small" />;
      case '1': return <Chip label="Processing" color="info" size="small" />;
      case '2': return <Chip label="Shipped" color="primary" size="small" />;
      case '3': return <Chip label="Delivered" color="success" size="small" />;
      case '4': return <Chip label="Completed" color="success" variant="outlined" size="small" />;
      case '5': return <Chip label="Cancelled" color="error" size="small" />;
      case '6': return <Chip label="Refunded" color="default" size="small" />;
      default: return <Chip label={`Status: ${status}`} size="small" />;
    }
  };

  if (loading && orders.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        My Orders
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && orders.length === 0 && !error && (
        <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="subtitle1">You have no orders yet.</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/goods')}>
            Start Shopping
          </Button>
        </Paper>
      )}

      {orders.length > 0 && (
        <Paper elevation={1} sx={{ p: 2 }}>
          <List>
            {orders.map((order, index) => (
              <React.Fragment key={order.dealUUID || index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`Order ID: ${order.dealUUID}`}
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2" color="text.primary">
                          Goods: {order.goodsName || `(Goods UUID: ${order.goodsUUID})`} {/* Assuming goodsName is available */}
                        </Typography>
                        <br />
                        Shop: {order.shopName || `(Shop UUID: ${order.shopUUID})`} {/* Assuming shopName is available */}
                        <br />
                        Quantity: {order.dealCount} | Total Price: ¥{order.dealPrice?.toFixed(2)}
                        <br />
                        Order Date: {order.createTime ? new Date(order.createTime).toLocaleDateString() : 'N/A'}
                      </React.Fragment>
                    }
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {getStatusChip(order.status)}
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mt: 1 }}
                      // onClick={() => navigate(`/orders/${order.dealUUID}`)} // Optional: Navigate to order detail page
                    >
                      View Details
                    </Button>
                  </Box>
                </ListItem>
                {index < orders.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default OrdersPage;