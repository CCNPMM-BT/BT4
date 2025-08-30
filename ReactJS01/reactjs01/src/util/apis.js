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

export {
    createUserApi, loginApi, getUserApi
}