// Configuration file for the application
export const config = {
    // Backend API URL - change this to match your backend
    BACKEND_URL: 'http://localhost:8080',
    
    // API endpoints
    API_ENDPOINTS: {
        REGISTER: '/v1/api/register',
        LOGIN: '/v1/api/login',
        USER: '/v1/api/user',
        ACCOUNT: '/v1/api/account',
        CATEGORIES: '/v1/api/categories',
        PRODUCTS: '/v1/api/products',
        CATEGORY_PRODUCTS: '/v1/api/categories'
    },
    
    // Local storage keys
    STORAGE_KEYS: {
        ACCESS_TOKEN: 'access_token',
        USER_INFO: 'user_info'
    }
};
