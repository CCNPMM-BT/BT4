import axios from './axios.customize';
import { config } from '../config/config.js';

const createUserApi = (name, email, password) => {
    const data = {
        name, email, password
    }
    return axios.post(config.API_ENDPOINTS.REGISTER, data);
}

const loginApi = (email, password) => {
    const data = {
        email, password
    }
    return axios.post(config.API_ENDPOINTS.LOGIN, data);
}

const getUserApi = () => {
    return axios.get(config.API_ENDPOINTS.USER);
}

// Category APIs
const getAllCategoriesApi = () => {
    return axios.get(config.API_ENDPOINTS.CATEGORIES);
}

const getCategoryByIdApi = (categoryId) => {
    return axios.get(`${config.API_ENDPOINTS.CATEGORIES}/${categoryId}`);
}

// Product APIs
const getAllProductsApi = (page = 1, limit = 12, search = '') => {
    return axios.get(config.API_ENDPOINTS.PRODUCTS, {
        params: { page, limit, search }
    });
}

const getProductByIdApi = (productId) => {
    return axios.get(`${config.API_ENDPOINTS.PRODUCTS}/${productId}`);
}

const getProductsByCategoryApi = (categoryId, page = 1, limit = 12) => {
    return axios.get(`${config.API_ENDPOINTS.CATEGORY_PRODUCTS}/${categoryId}/products`, {
        params: { page, limit }
    });
}

// Advanced search API với Elasticsearch
const advancedSearchProductsApi = (searchParams) => {
    return axios.get(`${config.API_ENDPOINTS.PRODUCTS}/search`, {
        params: searchParams
    });
}

// Get search suggestions API
const getSearchSuggestionsApi = (query, limit = 10) => {
    return axios.get(`${config.API_ENDPOINTS.PRODUCTS}/suggestions`, {
        params: { q: query, limit }
    });
}

// Get similar products API
const getSimilarProductsApi = (productId, limit = 6) => {
    return axios.get(`${config.API_ENDPOINTS.PRODUCTS}/similar/${productId}`, {
        params: { limit }
    });
}

// Favorite products APIs
const addToFavoritesApi = (productId) => {
    return axios.post(`${config.API_ENDPOINTS.FAVORITES}/${productId}`);
}

const removeFromFavoritesApi = (productId) => {
    return axios.delete(`${config.API_ENDPOINTS.FAVORITES}/${productId}`);
}

const getFavoriteProductsApi = (page = 1, limit = 12) => {
    return axios.get(config.API_ENDPOINTS.FAVORITES, {
        params: { page, limit }
    });
}

const isFavoriteApi = (productId) => {
    return axios.get(`${config.API_ENDPOINTS.FAVORITES}/${productId}/check`);
}

// Viewed products APIs
const addToViewedProductsApi = (productId) => {
    return axios.post(`${config.API_ENDPOINTS.VIEWED_PRODUCTS}/${productId}`);
}

const getViewedProductsApi = (page = 1, limit = 12) => {
    return axios.get(config.API_ENDPOINTS.VIEWED_PRODUCTS, {
        params: { page, limit }
    });
}

const removeFromViewedProductsApi = (productId) => {
    return axios.delete(`${config.API_ENDPOINTS.VIEWED_PRODUCTS}/${productId}`);
}

const clearViewedProductsApi = () => {
    return axios.delete(config.API_ENDPOINTS.VIEWED_PRODUCTS);
}

// Comments APIs
const createCommentApi = (productId, content, rating) => {
    return axios.post(`${config.API_ENDPOINTS.PRODUCTS}/${productId}/comments`, {
        content, rating
    });
}

const getProductCommentsApi = (productId, page = 1, limit = 10) => {
    return axios.get(`${config.API_ENDPOINTS.PRODUCTS}/${productId}/comments`, {
        params: { page, limit }
    });
}

const updateCommentApi = (commentId, content, rating) => {
    return axios.put(`${config.API_ENDPOINTS.COMMENTS}/${commentId}`, {
        content, rating
    });
}

const deleteCommentApi = (commentId) => {
    return axios.delete(`${config.API_ENDPOINTS.COMMENTS}/${commentId}`);
}

const toggleCommentLikeApi = (commentId) => {
    return axios.post(`${config.API_ENDPOINTS.COMMENTS}/${commentId}/like`);
}

// Purchase APIs
const createPurchaseApi = (purchaseData) => {
    return axios.post(config.API_ENDPOINTS.PURCHASES, purchaseData);
}

const getUserPurchasesApi = (page = 1, limit = 10) => {
    return axios.get(config.API_ENDPOINTS.PURCHASES, {
        params: { page, limit }
    });
}

const getProductPurchaseStatsApi = (productId) => {
    return axios.get(`${config.API_ENDPOINTS.PRODUCTS}/${productId}/purchase-stats`);
}

// Cart APIs
const getCartApi = () => {
    return axios.get(config.API_ENDPOINTS.CART);
}

const addToCartApi = (productId, quantity = 1) => {
    return axios.post(config.API_ENDPOINTS.CART_ADD, {
        productId, quantity
    });
}

const updateCartItemApi = (productId, quantity) => {
    return axios.put(config.API_ENDPOINTS.CART_UPDATE, {
        productId, quantity
    });
}

const removeFromCartApi = (productId) => {
    return axios.delete(`${config.API_ENDPOINTS.CART_REMOVE}/${productId}`);
}

const clearCartApi = () => {
    return axios.delete(config.API_ENDPOINTS.CART_CLEAR);
}

const getCartCountApi = () => {
    return axios.get(config.API_ENDPOINTS.CART_COUNT);
}

export {
    createUserApi, 
    loginApi, 
    getUserApi,
    getAllCategoriesApi,
    getCategoryByIdApi,
    getAllProductsApi,
    getProductByIdApi,
    getProductsByCategoryApi,
    advancedSearchProductsApi,
    getSearchSuggestionsApi,
    getSimilarProductsApi,
    addToFavoritesApi,
    removeFromFavoritesApi,
    getFavoriteProductsApi,
    isFavoriteApi,
    addToViewedProductsApi,
    getViewedProductsApi,
    removeFromViewedProductsApi,
    clearViewedProductsApi,
    createCommentApi,
    getProductCommentsApi,
    updateCommentApi,
    deleteCommentApi,
    toggleCommentLikeApi,
    createPurchaseApi,
    getUserPurchasesApi,
    getProductPurchaseStatsApi,
    // Cart APIs
    getCartApi,
    addToCartApi,
    updateCartItemApi,
    removeFromCartApi,
    clearCartApi,
    getCartCountApi
}