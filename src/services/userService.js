import axios from 'axios';

const API_URL = '/api/user'; // Vite proxy will handle this

/**
 * Logs in a user.
 * @param {object} userData - User credentials (e.g., { username, password, role }).
 * @returns {Promise<object>} The server response.
 */
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

/**
 * Registers a common user.
 * @param {object} userData - Basic user info (username, password, role, email).
 * @param {object} commonUserData - Specific common user info.
 * @returns {Promise<object>} The server response.
 */
export const registerCommonUser = async (userData, commonUserData) => {
  try {
    // For multipart/form-data, we need to use FormData
    const formData = new FormData();
    formData.append('user', JSON.stringify(userData)); // Server expects JSON string for 'user'
    formData.append('commonUser', JSON.stringify(commonUserData)); // Server expects JSON string for 'commonUser'

    const response = await axios.post(`${API_URL}/registerCommon`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error registering common user:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Common user registration failed');
  }
};

/**
 * Registers a business user.
 * @param {object} userData - Basic user info.
 * @param {object} businessUserData - Specific business user info.
 * @param {File} licenseFile - The license file.
 * @param {File} identityFrontFile - The identity front file.
 * @param {File} identityBackFile - The identity back file.
 * @returns {Promise<object>} The server response.
 */
export const registerBusinessUser = async (userData, businessUserData, licenseFile, identityFrontFile, identityBackFile) => {
  try {
    const formData = new FormData();
    formData.append('user', JSON.stringify(userData));
    formData.append('businessUser', JSON.stringify(businessUserData));
    formData.append('licence', licenseFile);
    formData.append('identityFront', identityFrontFile);
    formData.append('identityBack', identityBackFile);

    const response = await axios.post(`${API_URL}/registerBusiness`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error registering business user:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Business user registration failed');
  }
};

/**
 * Fetches user details by ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} The user data.
 */
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/getUserById`, { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to fetch user data');
  }
};

/**
 * Gets the validation code image URL (or handles image fetching).
 * This endpoint on the backend directly serves an image.
 * You might need to set the <img> src attribute directly to this URL,
 * or fetch it as a blob if you need to process it first.
 */
export const getValidationCodeImageUrl = () => {
  // The browser will handle the session cookie automatically
  return `${API_URL}/getCode?timestamp=${new Date().getTime()}`; // Add timestamp to prevent caching if needed
};

/**
 * Validates the entered code against the one in session.
 * @param {string} code - The code entered by the user.
 * @returns {Promise<object>} The server response.
 */
export const validateCode = async (code) => {
  try {
    const response = await axios.get(`${API_URL}/validationCode`, { params: { code } });
    return response.data;
  } catch (error) {
    console.error('Error validating code:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Code validation failed');
  }
};

// Add other functions based on UserController.java, for example:
// export const getUserList = async (mode, currentPage, pageSize, status) => { ... };
// export const changeUserStatus = async (username, status) => { ... };
// export const updatePassword = async (email, oldPassword, newPassword) => { ... };
// ... and so on for all UserController endpoints.

// Remember to handle errors appropriately in each function.