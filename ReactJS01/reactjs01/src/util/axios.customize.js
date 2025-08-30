import axios from 'axios';
import { config } from '../config/config.js';

const instance = axios.create({
    baseURL: config.BACKEND_URL
});

// Alter defaults after instance has been created
instance.interceptors.request.use(function (config) {
    // config headers, add authorization
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
    return config;
}, function (error) {
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