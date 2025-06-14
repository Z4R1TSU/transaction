import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getGoodsListInCar,
  updateCount,
  updateStatus as updateCartItemStatus,
  // getGoodsByCommonIdAndUUID // Might not be needed directly on this page
} from '../services/shopCarService';
import { insertDeal } from '../services/dealService'; // For checkout
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Button,
  TextField,
  Divider,
  Grid,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState({}); // { goodsUUID: boolean }
  const navigate = useNavigate();

  // Placeholder for user ID - replace with actual user ID from context/auth
  const commonId = localStorage.getItem('userId') || 'temp-user-id'; // Or get from auth context

  const fetchCartItems = useCallback(async () => {
    if (!commonId) {
      setError('User not logged in.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Fetch active items in cart (status '0' or as per your backend logic)
      const response = await getGoodsListInCar(commonId, '0'); 
      if (response.data && response.data.code === 200) {
        setCartItems(response.data.data || []);
      } else {
        setCartItems([]);
        setError(response.data.message || 'Failed to load cart items.');
      }
    } catch (err) {
      setCartItems([]);
      setError(err.message || 'An error occurred while fetching cart items.');
    }
    setLoading(false);
  }, [commonId]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleQuantityChange = async (goodsUUID, newCount) => {
    if (newCount < 1) return; // Or handle removal if count is 0

    // Optimistic UI update (optional)
    // const originalItems = [...cartItems];
    // setCartItems(items => items.map(item => item.goodsUUID === goodsUUID ? {...item, goodsCount: newCount} : item));

    try {
      const response = await updateCount(goodsUUID, commonId, newCount > cartItems.find(item => item.goodsUUID === goodsUUID).goodsCount);
      if (response.data && response.data.code === 200) {
        // Refetch or update item count locally more precisely
        fetchCartItems(); 
      } else {
        setError(response.data.message || 'Failed to update quantity.');
        // setCartItems(originalItems); // Revert optimistic update
      }
    } catch (err) {
      setError(err.message || 'Error updating quantity.');
      // setCartItems(originalItems); // Revert optimistic update
    }
  };

  const handleRemoveItem = async (goodsUUID) => {
    try {
      // Backend might expect status '2' for removed, or just delete it.
      // This example uses updateStatus to mark as 'removed' (status '2')
      const response = await updateCartItemStatus(goodsUUID, commonId, '2'); 
      if (response.data && response.data.code === 200) {
        fetchCartItems(); // Refresh cart
      } else {
        setError(response.data.message || 'Failed to remove item.');
      }
    } catch (err) {
      setError(err.message || 'Error removing item.');
    }
  };

  const handleSelectItem = (goodsUUID) => {
    setSelectedItems(prev => ({
      ...prev,
      [goodsUUID]: !prev[goodsUUID]
    }));
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelectedItems = {};
      cartItems.forEach(item => newSelectedItems[item.goodsUUID] = true);
      setSelectedItems(newSelectedItems);
    } else {
      setSelectedItems({});
    }
  };

  const getSelectedCartItems = () => {
    return cartItems.filter(item => selectedItems[item.goodsUUID]);
  };

  const calculateTotalPrice = () => {
    return getSelectedCartItems().reduce((total, item) => total + (item.goodsPrice * item.goodsCount), 0);
  };

  const handleCheckout = async () => {
    const itemsToCheckout = getSelectedCartItems();
    if (itemsToCheckout.length === 0) {
      setError('Please select items to checkout.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // This is a simplified checkout. Your backend might need more complex logic.
      // For example, creating one deal per shop, or one deal for all items.
      // This example assumes creating one deal for all selected items.
      // You'll need to adapt this to your `insertDeal` service and backend requirements.

      const dealPromises = itemsToCheckout.map(item => {
        const dealData = {
          dealUUID: '', // Backend should generate this
          goodsUUID: item.goodsUUID,
          shopUUID: item.shopUUID, // Assuming shopUUID is part of cart item data
          commonId: commonId,
          businessId: item.businessId, // Assuming businessId (seller's user ID) is part of cart item data
          dealCount: item.goodsCount,
          dealPrice: item.goodsPrice * item.goodsCount,
          // status: '0', // Initial status, e.g., 'Pending Payment'
          // assess: '', // Assessment comes later
        };
        return insertDeal(dealData);
      });

      const results = await Promise.all(dealPromises);
      
      let allSuccessful = true;
      results.forEach(response => {
        if (!response.data || response.data.code !== 200) { // Adjust success code
          allSuccessful = false;
          setError(prev => prev + (response.data.message || `Failed to create deal for an item. `));
        }
      });

      if (allSuccessful) {
        alert('Checkout successful! Your order has been placed.'); // Replace with better notification
        // Mark items as 'ordered' (e.g., status '1') in cart or remove them
        const updatePromises = itemsToCheckout.map(item => updateCartItemStatus(item.goodsUUID, commonId, '1'));
        await Promise.all(updatePromises);
        fetchCartItems(); // Refresh cart
        setSelectedItems({});
        navigate('/orders'); // Navigate to orders page
      } else {
        // Some deals might have failed, error message is already set
      }

    } catch (err) {
      setError(err.message || 'An error occurred during checkout.');
    }
    setLoading(false);
  };

  if (loading && cartItems.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Your Shopping Cart
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && cartItems.length > 0 && <Box sx={{ display: 'flex', justifyContent: 'center', my:2 }}><CircularProgress size={24} /></Box>}

      {cartItems.length === 0 && !loading && (
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Your cart is empty.</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/goods')}>
            Continue Shopping
          </Button>
        </Paper>
      )}

      {cartItems.length > 0 && (
        <Paper elevation={2} sx={{ p: 2 }}>
          <FormControlLabel
            control={<Checkbox checked={Object.keys(selectedItems).length > 0 && Object.keys(selectedItems).length === cartItems.length && cartItems.every(item => selectedItems[item.goodsUUID])} onChange={handleSelectAll} />}
            label="Select All"
            sx={{mb: 1, ml: 1}}
          />
          <List>
            {cartItems.map((item) => (
              <React.Fragment key={item.goodsUUID}>
                <ListItem sx={{ py: 2 }} secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item.goodsUUID)}>
                    <DeleteIcon />
                  </IconButton>
                }>
                  <Checkbox 
                    checked={!!selectedItems[item.goodsUUID]}
                    onChange={() => handleSelectItem(item.goodsUUID)}
                    sx={{mr:1}}
                  />
                  <ListItemAvatar sx={{mr:1}}>
                    <Avatar 
                        variant="square" 
                        src={item.goodsPicture || '/placeholder-image.jpg'}  // Assuming goodsPicture is available
                        alt={item.goodsName}
                        sx={{width: 60, height: 60}}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.goodsName}
                    secondary={`Price: ¥${item.goodsPrice?.toFixed(2)} - Shop: ${item.shopName || 'N/A'}`}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
                    <IconButton size="small" onClick={() => handleQuantityChange(item.goodsUUID, item.goodsCount - 1)} disabled={item.goodsCount <= 1}>
                      <RemoveIcon />
                    </IconButton>
                    <TextField 
                        value={item.goodsCount} 
                        size="small" 
                        sx={{width: '50px', textAlign: 'center', mx:0.5}} 
                        inputProps={{readOnly: true, style: { textAlign: 'center' } }} 
                    />
                    <IconButton size="small" onClick={() => handleQuantityChange(item.goodsUUID, item.goodsCount + 1)}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="subtitle1" sx={{ minWidth: '80px', textAlign: 'right' }}>
                    ¥{(item.goodsPrice * item.goodsCount).toFixed(2)}
                  </Typography>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h6">
                  Total for selected: ¥{calculateTotalPrice().toFixed(2)}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={<ShoppingCartCheckoutIcon />}
                  onClick={handleCheckout}
                  disabled={getSelectedCartItems().length === 0 || loading}
                >
                  Checkout ({getSelectedCartItems().length} items)
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default CartPage;