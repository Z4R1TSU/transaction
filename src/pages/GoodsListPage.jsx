import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { goodsFilter, getGoodsType, getGoodsCount } from '../services/goodsService';
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';

const GoodsListPage = () => {
  const [goods, setGoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [goodsTypes, setGoodsTypes] = useState([]);
  const [filters, setFilters] = useState({
    goodsName: '',
    goodsType: '',
    minPrice: '',
    maxPrice: '',
    status: '1', // Default to show available goods
  });
  const pageSize = 12; // Number of items per page
  const navigate = useNavigate();

  const fetchGoodsTypes = useCallback(async () => {
    try {
      const response = await getGoodsType();
      if (response.data && response.data.code === 200) {
        setGoodsTypes(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to load goods types.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching goods types.');
    }
  }, []);

  const fetchGoods = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const filterParams = {
        goodsName: filters.goodsName || null,
        goodsType: filters.goodsType || null,
        minPrice: filters.minPrice ? parseFloat(filters.minPrice) : null,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : null,
        status: filters.status || null,
      };

      const response = await goodsFilter(filterParams, currentPage, pageSize);
      if (response.data && response.data.code === 200) {
        setGoods(response.data.data || []);
        const countResponse = await getGoodsCount(filterParams);
        if (countResponse.data && countResponse.data.code === 200) {
          setTotalPages(Math.ceil(countResponse.data.data / pageSize));
        } else {
          setTotalPages(0);
        }
      } else {
        setGoods([]);
        setTotalPages(0);
        setError(response.data.message || 'Failed to load goods.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching goods.');
      setGoods([]);
      setTotalPages(0);
    }
    setLoading(false);
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    fetchGoodsTypes();
  }, [fetchGoodsTypes]);

  useEffect(() => {
    fetchGoods();
  }, [fetchGoods]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchGoods(); // fetchGoods will be called by useEffect due to filters dependency change
  };

  const handleResetFilters = () => {
    setFilters({
        goodsName: '',
        goodsType: '',
        minPrice: '',
        maxPrice: '',
        status: '1',
    });
    setCurrentPage(1);
    // fetchGoods will be called by useEffect due to filters dependency change
  };

  if (loading && !goods.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Explore Goods
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Filters</Typography>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Goods Name"
              name="goodsName"
              value={filters.goodsName}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Goods Type</InputLabel>
              <Select
                name="goodsType"
                value={filters.goodsType}
                onChange={handleFilterChange}
                label="Goods Type"
              >
                <MenuItem value=""><em>All Types</em></MenuItem>
                {goodsTypes.map((type) => (
                  <MenuItem key={type.typeId} value={type.typeName}>
                    {type.typeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Min Price"
              name="minPrice"
              type="number"
              value={filters.minPrice}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Max Price"
              name="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
             <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                label="Status"
              >
                <MenuItem value=""><em>All Statuses</em></MenuItem>
                <MenuItem value="0">Unavailable</MenuItem>
                <MenuItem value="1">Available</MenuItem>
                <MenuItem value="2">Sold</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={1} sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleApplyFilters} size="medium" fullWidth>Apply</Button>
          </Grid>
           <Grid item xs={12} sm={6} md={1} sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={handleResetFilters} size="medium" fullWidth>Reset</Button>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my:2 }}><CircularProgress /></Box>}

      {!loading && !goods.length && !error && (
        <Typography variant="subtitle1" align="center" sx={{ my: 4 }}>
          No goods found matching your criteria.
        </Typography>
      )}

      <Grid container spacing={3}>
        {goods.map((good) => (
          <Grid item key={good.goodsUUID} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardActionArea component={RouterLink} to={`/goods/${good.goodsUUID}`}>
                <CardMedia
                  component="img"
                  height="200"
                  // Assuming goodsPicture is a URL or base64 string. 
                  // If it's an array of pictures, you might want to display the first one.
                  // Placeholder if no image is available.
                  image={good.goodsPicture ? (typeof good.goodsPicture === 'string' ? good.goodsPicture : good.goodsPicture[0]?.url || '/placeholder-image.jpg') : '/placeholder-image.jpg'}
                  alt={good.goodsName}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {good.goodsName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Type: {good.goodsType}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    ¥{good.goodsPrice?.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Stock: {good.goodsStock}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
};

export default GoodsListPage;