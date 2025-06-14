import axios from 'axios';

const API_URL = '/api/deal';

/**
 * Insert a new deal.
 * @param {object} deal - Deal details.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const insertDeal = (deal) => {
    return axios.post(`${API_URL}/insertDeal`, deal);
};

/**
 * Filter deals based on criteria.
 * @param {object} deal - Deal filter criteria.
 * @param {number} [currentPage] - Current page number (optional).
 * @param {number} [pageSize] - Number of items per page (optional).
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const dealFilter = (deal, currentPage, pageSize) => {
    return axios.get(`${API_URL}/dealFilter`, {
        params: {
            ...deal,
            currentPage,
            pageSize
        }
    });
};

/**
 * Confirm receipt of a deal.
 * @param {string} dealUUID - The UUID of the deal.
 * @param {string} assess - Assessment/review for the deal.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const receipt = (dealUUID, assess) => {
    return axios.get(`${API_URL}/receipt`, {
        params: { dealUUID, assess }
    });
};

/**
 * Return goods for a deal.
 * @param {string} dealUUID - The UUID of the deal.
 * @param {string} assess - Assessment/review for the return.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const returnGoods = (dealUUID, assess) => {
    return axios.get(`${API_URL}/returnGoods`, {
        params: { dealUUID, assess }
    });
};

/**
 * Update the status of a deal.
 * @param {string} dealUUID - The UUID of the deal.
 * @param {string} status - The new status of the deal.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateDealStatus = (dealUUID, status) => {
    return axios.get(`${API_URL}/updateDealStatus`, {
        params: { dealUUID, status }
    });
};

/**
 * Trigger automatic receipt of deals (system process).
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const autoReceipt = () => {
    return axios.get(`${API_URL}/autoReceipt`);
};

/**
 * Trigger automatic completion of deals (system process).
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const autoComplete = () => {
    return axios.get(`${API_URL}/autoComplete`);
};

/**
 * Get the count of deals based on filter criteria.
 * @param {object} deal - Deal filter criteria.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getDealCount = (deal) => {
    return axios.get(`${API_URL}/getDealCount`, {
        params: deal
    });
};

export default {
    insertDeal,
    dealFilter,
    receipt,
    returnGoods,
    updateDealStatus,
    autoReceipt,
    autoComplete,
    getDealCount
};