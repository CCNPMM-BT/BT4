import axios from 'axios';
import { config } from '../config/config.js';

const instance = axios.create({
    baseURL: config.BACKEND_URL
});

// Alter defaults after instance has been created
instance.interceptors.request.use(function (config) {
    // config headers, add authorization
    const token = localStorage.getItem('access_token');
    console.log('Request interceptor - Token from localStorage:', token ? 'Found' : 'Not found');
    console.log('Request URL:', config.url);
    console.log('Request method:', config.method);
    
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
    } else {
        console.log('No token found - request will be sent without Authorization header');
    }
    
    console.log('Final headers:', config.headers);
    return config;
}, function (error) {
    console.log('Request interceptor error:', error);
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response && response.data) return response.data;
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.data) return error.response.data;
    return Promise.reject(error);
});

export default instance;