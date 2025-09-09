const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const { getAllCategories, getCategoryById, createCategory } = require('../controllers/categoryController');
const { 
    getProductsByCategory, 
    getAllProducts, 
    getProductById, 
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getSearchSuggestions,
    getPopularSearches,
    getFilterOptions
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const publicAuth = require('../middleware/publicAuth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

// Public routes (không cần authentication)
routerAPI.get('/categories', getAllCategories);
routerAPI.get('/categories/:id', getCategoryById);
routerAPI.get('/products', getAllProducts);
routerAPI.get('/products/:id', getProductById);
routerAPI.get('/categories/:categoryId/products', getProductsByCategory);

// Search routes (public)
routerAPI.get('/search/products', searchProducts);
routerAPI.get('/search/suggestions', getSearchSuggestions);
routerAPI.get('/search/popular', getPopularSearches);
routerAPI.get('/search/filters', getFilterOptions);

// Protected routes (cần authentication)
routerAPI.all('*', auth);

routerAPI.get('/', (req, res) => {
    return res.status(200).json('Hello world api');
});

routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);
routerAPI.get('/user', getUser);
routerAPI.get('/account', delay, getAccount);

// Admin routes (cần authentication)
routerAPI.post('/categories', createCategory);
routerAPI.post('/products', createProduct);
routerAPI.put('/products/:id', updateProduct);
routerAPI.delete('/products/:id', deleteProduct);

module.exports = routerAPI;