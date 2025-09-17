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
        CATEGORY_PRODUCTS: '/v1/api/categories',
        FAVORITES: '/v1/api/favorites',
        VIEWED_PRODUCTS: '/v1/api/viewed-products',
        COMMENTS: '/v1/api/comments',
        PURCHASES: '/v1/api/purchases',
        CART: '/v1/api/cart',
        CART_ADD: '/v1/api/cart/add',
        CART_UPDATE: '/v1/api/cart/update',
        CART_REMOVE: '/v1/api/cart/remove',
        CART_CLEAR: '/v1/api/cart/clear',
        CART_COUNT: '/v1/api/cart/count'
    },
    
    // Local storage keys
    STORAGE_KEYS: {
        ACCESS_TOKEN: 'access_token',
        USER_INFO: 'user_info'
    }
};
