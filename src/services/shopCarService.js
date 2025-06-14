import axios from 'axios';

const API_URL = '/api/shopCar';

/**
 * Insert goods into the shopping cart.
 * @param {object} shopCar - Shopping cart item details.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const insertToCar = (shopCar) => {
    return axios.post(`${API_URL}/insertToCar`, shopCar);
};

/**
 * Update the count of an item in the shopping cart.
 * @param {string} goodsUUID - The UUID of the good.
 * @param {string} commonId - The common ID of the user.
 * @param {boolean} countUpper - True to increase count, false to decrease.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateCount = (goodsUUID, commonId, countUpper) => {
    return axios.get(`${API_URL}/updateCount`, {
        params: { goodsUUID, commonId, countUpper }
    });
};

/**
 * Get the list of goods in the shopping cart for a user.
 * @param {string} commonId - The common ID of the user.
 * @param {string} status - The status of the items in the cart.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getGoodsListInCar = (commonId, status) => {
    return axios.get(`${API_URL}/getGoodsListInCar`, {
        params: { commonId, status }
    });
};

/**
 * Get a specific good from the shopping cart by goodsUUID and commonId.
 * @param {string} goodsUUID - The UUID of the good.
 * @param {string} commonId - The common ID of the user.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getGoodsByCommonIdAndUUID = (goodsUUID, commonId) => {
    return axios.get(`${API_URL}/getGoodsByCommonIdAndUUID`, {
        params: { goodsUUID, commonId }
    });
};

/**
 * Update the status of an item in the shopping cart.
 * @param {string} goodsUUID - The UUID of the good.
 * @param {string} commonId - The common ID of the user.
 * @param {string} status - The new status of the item.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateStatus = (goodsUUID, commonId, status) => {
    return axios.get(`${API_URL}/updateStatus`, {
        params: { goodsUUID, commonId, status }
    });
};

export default {
    insertToCar,
    updateCount,
    getGoodsListInCar,
    getGoodsByCommonIdAndUUID,
    updateStatus
};