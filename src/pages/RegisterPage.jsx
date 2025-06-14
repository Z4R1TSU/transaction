import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCommonUser, registerBusinessUser, getValidationCodeImageUrl, validateCode } from '../services/userService';
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
  MenuItem,
  Grid,
  Paper
} from '@mui/material';

const RegisterPage = () => {
  const [userType, setUserType] = useState('common'); // 'common' or 'business'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [validationCode, setValidationCode] = useState('');
  const [validationCodeUrl, setValidationCodeUrl] = useState('');

  // Common User Specific
  const [realName, setRealName] = useState('');
  const [studentId, setStudentId] = useState('');

  // Business User Specific
  const [shopName, setShopName] = useState('');
  const [businessLicense, setBusinessLicense] = useState(null);
  const [idCardFront, setIdCardFront] = useState(null);
  const [idCardBack, setIdCardBack] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    handleRefreshValidationCode();
  }, []);

  const handleRefreshValidationCode = () => {
    setValidationCodeUrl(getValidationCodeImageUrl());
  };

  const handleFileChange = (setter) => (event) => {
    setter(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // First, validate the code
      const validationResponse = await validateCode(validationCode);
      if (validationResponse.code !== 200) { // Assuming 200 is success for validation
        setError(validationResponse.message || 'Invalid validation code.');
        setLoading(false);
        handleRefreshValidationCode(); // Refresh code on failure
        return;
      }

      const userData = { username, password, email, role: userType === 'common' ? '0' : '1' };

      let response;
      if (userType === 'common') {
        if (!realName || !studentId) {
          setError('Real name and student ID are required for common users.');
          setLoading(false);
          return;
        }
        const commonUserData = { realName, studentId };
        response = await registerCommonUser(userData, commonUserData);
      } else {
        if (!shopName || !businessLicense || !idCardFront || !idCardBack) {
          setError('Shop name and all document uploads are required for business users.');
          setLoading(false);
          return;
        }
        const businessUserData = { shopName }; // Add other business-specific fields if any
        response = await registerBusinessUser(userData, businessUserData, businessLicense, idCardFront, idCardBack);
      }

      if (response && (response.code === 2002 || response.code === 2003)) { // Assuming 2002/2003 are success codes
        setSuccess(response.message || 'Registration successful! Please login.');
        setTimeout(() => navigate('/login'), 2000); // Redirect to login after a delay
      } else {
        setError(response.message || 'Registration failed.');
        handleRefreshValidationCode(); // Refresh code on failure
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during registration.');
      handleRefreshValidationCode(); // Refresh code on error
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ marginTop: 8, padding: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Register New Account
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="user-type-label">Account Type</InputLabel>
            <Select
              labelId="user-type-label"
              value={userType}
              label="Account Type"
              onChange={(e) => setUserType(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="common">Common User (Student/Faculty)</MenuItem>
              <MenuItem value="business">Business User (Merchant)</MenuItem>
            </Select>
          </FormControl>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </Grid>

              {userType === 'common' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Real Name"
                      value={realName}
                      onChange={(e) => setRealName(e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Student/Faculty ID"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                </>
              )}

              {userType === 'business' && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Shop Name"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button variant="contained" component="label" fullWidth disabled={loading}>
                      Business License
                      <input type="file" hidden onChange={handleFileChange(setBusinessLicense)} accept=".jpg,.jpeg,.png,.pdf" />
                    </Button>
                    {businessLicense && <Typography variant="caption">{businessLicense.name}</Typography>}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button variant="contained" component="label" fullWidth disabled={loading}>
                      ID Card (Front)
                      <input type="file" hidden onChange={handleFileChange(setIdCardFront)} accept=".jpg,.jpeg,.png" />
                    </Button>
                    {idCardFront && <Typography variant="caption">{idCardFront.name}</Typography>}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button variant="contained" component="label" fullWidth disabled={loading}>
                      ID Card (Back)
                      <input type="file" hidden onChange={handleFileChange(setIdCardBack)} accept=".jpg,.jpeg,.png" />
                    </Button>
                    {idCardBack && <Typography variant="caption">{idCardBack.name}</Typography>}
                  </Grid>
                </>
              )}
              <Grid item xs={12} sm={8}>
                 <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="validationCode"
                    label="Validation Code"
                    id="validationCode"
                    value={validationCode}
                    onChange={(e) => setValidationCode(e.target.value)}
                    disabled={loading}
                  />
              </Grid>
              <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', mt:1}}>
                {validationCodeUrl && <img src={validationCodeUrl} alt="Validation Code" onClick={handleRefreshValidationCode} style={{ cursor: 'pointer', height: '50px', border: '1px solid #ccc', borderRadius: '4px' }} />}
              </Grid>
            </Grid>

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
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;