import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGoodsByUUID } from '../services/goodsService';
import { insertToCar } from '../services/shopCarService'; // Assuming you have this service
import { getCommentListByGoodsUUID, insertComment } from '../services/commentService';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Paper,
  ImageList,
  ImageListItem,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const GoodsDetailPage = () => {
  const { id: goodsUUID } = useParams();
  const navigate = useNavigate();
  const [good, setGood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Placeholder for user ID - replace with actual user ID from context/auth
  const userId = localStorage.getItem('userId') || 'temp-user-id'; // Or get from auth context

  const fetchGoodsDetail = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getGoodsByUUID(goodsUUID);
      if (response.data && response.data.code === 200) {
        setGood(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load goods details.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching goods details.');
    }
    setLoading(false);
  }, [goodsUUID]);

  const fetchComments = useCallback(async () => {
    if (!goodsUUID) return;
    setCommentLoading(true);
    try {
      const response = await getCommentListByGoodsUUID(goodsUUID);
      if (response.data && response.data.code === 200) {
        setComments(response.data.data || []);
      } else {
        setCommentError(response.data.message || 'Failed to load comments.');
      }
    } catch (err) {
      setCommentError(err.message || 'An error occurred while fetching comments.');
    }
    setCommentLoading(false);
  }, [goodsUUID]);

  useEffect(() => {
    fetchGoodsDetail();
    fetchComments();
  }, [fetchGoodsDetail, fetchComments]);

  const handleAddToCart = async () => {
    if (!good || !userId) {
      setError('Goods details or user information is missing.');
      return;
    }
    if (quantity <= 0) {
        setError('Quantity must be greater than zero.');
        return;
    }
    if (quantity > good.goodsStock) {
        setError('Quantity exceeds available stock.');
        return;
    }

    setLoading(true); // Use main loading for cart action
    try {
      const cartItem = {
        goodsUUID: good.goodsUUID,
        commonId: userId, // Assuming commonId is the user's ID
        goodsCount: quantity,
        // status might be set by backend or based on your logic, e.g., '0' for active
      };
      const response = await insertToCar(cartItem);
      if (response.data && response.data.code === 200) { // Adjust success code as per your API
        alert('Added to cart successfully!'); // Replace with a nicer notification
        // Optionally navigate to cart or update cart icon
      } else {
        setError(response.data.message || 'Failed to add to cart.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while adding to cart.');
    }
    setLoading(false);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty.');
      return;
    }
    setCommentLoading(true);
    setCommentError('');
    try {
      const commentData = {
        goodsUUID: goodsUUID,
        userId: userId, // Or however your backend identifies the commenter
        commentContent: newComment,
        // replyId: null, // For top-level comments
      };
      const response = await insertComment(commentData);
      if (response.data && response.data.code === 200) { // Adjust success code
        setNewComment('');
        fetchComments(); // Refresh comments list
      } else {
        setCommentError(response.data.message || 'Failed to post comment.');
      }
    } catch (err) {
      setCommentError(err.message || 'An error occurred while posting comment.');
    }
    setCommentLoading(false);
  };

  if (loading && !good) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }

  if (!good) {
    return <Container sx={{ py: 4 }}><Typography variant="h5" align="center">Goods not found.</Typography></Container>;
  }

  // Assuming good.goodsPicture can be a single URL string or an array of picture objects/URLs
  const pictureList = Array.isArray(good.goodsPicture) ? good.goodsPicture : (good.goodsPicture ? [good.goodsPicture] : []);

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {pictureList.length > 0 ? (
              <ImageList sx={{ width: '100%', height: 450 }} cols={1} rowHeight={450}>
                {pictureList.map((pic, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={typeof pic === 'string' ? pic : pic.url || '/placeholder-image.jpg'} // Handle if pic is string URL or object with URL
                      alt={`${good.goodsName} - ${index + 1}`}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            ) : (
              <Box sx={{ height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
                <Typography>No Image Available</Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {good.goodsName}
            </Typography>
            <Chip label={good.goodsType || 'Uncategorized'} color="secondary" sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
              {good.goodsDescribe || 'No description available.'}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              ¥{good.goodsPrice?.toFixed(2)}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Stock: {good.goodsStock > 0 ? good.goodsStock : <span style={{color: 'red'}}>Out of Stock</span>}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Shop: {good.shopName || 'N/A'} (UUID: {good.shopUUID})
            </Typography>
             <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Praise Rate: {good.praiseRate !== null && good.praiseRate !== undefined ? `${(good.praiseRate * 100).toFixed(1)}%` : 'N/A'}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Status: {good.status === '0' ? 'Unavailable' : good.status === '1' ? 'Available' : 'Sold'}
            </Typography>

            {good.goodsStock > 0 && good.status === '1' && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 3 }}>
                <TextField
                  label="Quantity"
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: good.goodsStock } }}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  sx={{ width: '100px', mr: 2 }}
                  size="small"
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={handleAddToCart}
                  disabled={loading || good.goodsStock === 0}
                  size="large"
                >
                  Add to Cart
                </Button>
              </Box>
            )}
            {error && <Alert severity="error" sx={{mt:1}}>{error}</Alert>}
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>Comments</Typography>
        <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            variant="outlined"
            margin="normal"
            disabled={commentLoading}
          />
          {commentError && <Alert severity="error" sx={{ mb: 1 }}>{commentError}</Alert>}
          <Button type="submit" variant="contained" disabled={commentLoading || !newComment.trim()}>
            {commentLoading ? <CircularProgress size={24} /> : 'Post Comment'}
          </Button>
        </Box>
        <Divider sx={{mb: 2}}/>
        {commentLoading && !comments.length && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
        {comments.length > 0 ? (
          <List>
            {comments.map((comment) => (
              <React.Fragment key={comment.commentId}>
                <ListItem alignItems="flex-start">
                  <Avatar sx={{ mr: 2 }}>{comment.userName ? comment.userName.charAt(0) : 'U'}</Avatar> {/* Assuming userName is available */}
                  <ListItemText
                    primary={comment.commentContent}
                    secondary={`By ${comment.userName || 'Anonymous'} - ${new Date(comment.commentTime).toLocaleString()}`}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          !commentLoading && <Typography>No comments yet. Be the first to comment!</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default GoodsDetailPage;