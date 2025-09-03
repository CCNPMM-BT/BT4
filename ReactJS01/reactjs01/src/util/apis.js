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

export {
    createUserApi, 
    loginApi, 
    getUserApi,
    getAllCategoriesApi,
    getCategoryByIdApi,
    getAllProductsApi,
    getProductByIdApi,
    getProductsByCategoryApi
}