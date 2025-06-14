import axios from 'axios';

const API_URL = '/api/shop';

/**
 * Filter shops based on criteria.
 * @param {object} shop - Shop filter criteria.
 * @param {number} currentPage - Current page number.
 * @param {number} pageSize - Number of items per page.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const shopFilter = (shop, currentPage, pageSize) => {
    return axios.get(`${API_URL}/shopFilter`, {
        params: {
            ...shop,
            currentPage,
            pageSize
        }
    });
};

/**
 * Update shop level.
 * @param {string} shopUUID - The UUID of the shop.
 * @param {boolean} upper - True to upgrade, false to downgrade.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateShopLevel = (shopUUID, upper) => {
    return axios.get(`${API_URL}/updateShopLevel`, {
        params: { shopUUID, upper }
    });
};

/**
 * Update shop status (open/closed).
 * @param {string} shopUUID - The UUID of the shop.
 * @param {boolean} isOpen - True for open, false for closed.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateShopStatus = (shopUUID, isOpen) => {
    return axios.get(`${API_URL}/updateShopStatus`, {
        params: { shopUUID, isOpen }
    });
};

/**
 * Update shop name.
 * @param {string} shopUUID - The UUID of the shop.
 * @param {string} shopName - The new name of the shop.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateShopName = (shopUUID, shopName) => {
    return axios.get(`${API_URL}/updateShopName`, {
        params: { shopUUID, shopName }
    });
};

/**
 * Update shop praise rate.
 * @param {string} shopUUID - The UUID of the shop.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateShopPraiseRate = (shopUUID) => {
    return axios.get(`${API_URL}/updateShopPraiseRate`, {
        params: { shopUUID }
    });
};

/**
 * Get shop count based on filter criteria.
 * @param {object} shop - Shop filter criteria.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getShopCount = (shop) => {
    return axios.get(`${API_URL}/getShopCount`, {
        params: shop
    });
};

export default {
    shopFilter,
    updateShopLevel,
    updateShopStatus,
    updateShopName,
    updateShopPraiseRate,
    getShopCount
};