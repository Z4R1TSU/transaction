import axios from 'axios';

const API_URL = '/api/goods/comment'; // Note the specific path for comments

/**
 * Insert a new comment.
 * @param {object} comment - Comment details.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const insertComment = (comment) => {
    return axios.post(`${API_URL}/insertComment`, comment);
};

/**
 * Get a list of comments for a specific good.
 * @param {string} goodsUUID - The UUID of the good.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getCommentListByGoodsUUID = (goodsUUID) => {
    return axios.get(`${API_URL}/getCommentListByGoodsUUID`, {
        params: { goodsUUID }
    });
};

/**
 * Get the count of comments based on filter criteria.
 * @param {string} goodsUUID - The UUID of the good.
 * @param {string} [userId] - The ID of the user (optional).
 * @param {string} [replyId] - The ID of the reply (optional).
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getCommentCount = (goodsUUID, userId, replyId) => {
    return axios.get(`${API_URL}/getCommentCount`, {
        params: { goodsUUID, userId, replyId }
    });
};

export default {
    insertComment,
    getCommentListByGoodsUUID,
    getCommentCount
};