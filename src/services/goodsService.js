import axios from 'axios';

const API_URL = '/api/Goods';

/**
 * Filter goods based on criteria.
 * @param {object} goods - Goods filter criteria.
 * @param {number} currentPage - Current page number.
 * @param {number} pageSize - Number of items per page.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const goodsFilter = (goods, currentPage, pageSize) => {
    return axios.get(`${API_URL}/goodsFilter`, {
        params: {
            ...goods,
            currentPage,
            pageSize
        }
    });
};

/**
 * Insert a new good with pictures.
 * @param {FormData} formData - FormData containing goods data and pictures.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const insertGoods = (formData) => {
    return axios.post(`${API_URL}/insertGoods`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * Update goods information, optionally with new pictures.
 * @param {FormData} formData - FormData containing goods data and optional pictures.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateGoodsInfo = (formData) => {
    return axios.post(`${API_URL}/updateGoodsInfo`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * Get goods details by UUID.
 * @param {string} goodsUUID - The UUID of the good.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getGoodsByUUID = (goodsUUID) => {
    return axios.get(`${API_URL}/getGoodsByUUID`, {
        params: { goodsUUID }
    });
};

/**
 * Change the status of a good.
 * @param {string} goodsUUID - The UUID of the good.
 * @param {string} status - The new status.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const changeGoodsStatus = (goodsUUID, status) => {
    return axios.get(`${API_URL}/changeGoodsStatus`, {
        params: { goodsUUID, status }
    });
};

/**
 * Update the praise rate of a good.
 * @param {string} goodsUUID - The UUID of the good.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateGoodsPraiseRate = (goodsUUID) => {
    return axios.get(`${API_URL}/updateGoodsPraiseRate`, {
        params: { goodsUUID }
    });
};

/**
 * Get all goods types.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getGoodsType = () => {
    return axios.get(`${API_URL}/getGoodsType`);
};

/**
 * Get the count of goods based on filter criteria.
 * @param {object} goods - Goods filter criteria.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getGoodsCount = (goods) => {
    return axios.get(`${API_URL}/getGoodsCount`, {
        params: goods
    });
};

export default {
    goodsFilter,
    insertGoods,
    updateGoodsInfo,
    getGoodsByUUID,
    changeGoodsStatus,
    updateGoodsPraiseRate,
    getGoodsType,
    getGoodsCount
};