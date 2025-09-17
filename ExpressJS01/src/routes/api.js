const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const { getAllCategories, getCategoryById, createCategory } = require('../controllers/categoryController');
const { 
    getProductsByCategory, 
    getAllProducts, 
    advancedSearchProducts, 
    getSearchSuggestions, 
    getProductById, 
    createProduct,
    getSimilarProducts,
    getTrendingProducts,
    getSearchFacets,
    searchWithTypoTolerance
} = require('../controllers/productController');
const {
    addToFavoritesController,
    removeFromFavoritesController,
    getFavoriteProductsController,
    isFavoriteController
} = require('../controllers/favoriteController');
const {
    getUserCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    clearUserCart,
    getCartCount
} = require('../controllers/cartController');
const {
    addToViewedProductsController,
    getViewedProductsController,
    removeFromViewedProductsController,
    clearViewedProductsController
} = require('../controllers/viewedProductController');
const {
    createCommentController,
    getProductCommentsController,
    updateCommentController,
    deleteCommentController,
    toggleCommentLikeController
} = require('../controllers/commentController');
const {
    createPurchaseController,
    updatePurchaseStatusController,
    getUserPurchasesController,
    getProductPurchaseStatsController,
    getPurchaseByIdController
} = require('../controllers/purchaseController');
const auth = require('../middleware/auth');
const publicAuth = require('../middleware/publicAuth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

// Public routes (không cần authentication)
routerAPI.get('/categories', getAllCategories);
routerAPI.get('/categories/:id', getCategoryById);
routerAPI.get('/products', getAllProducts);
routerAPI.get('/products/search', advancedSearchProducts);
routerAPI.get('/products/suggestions', getSearchSuggestions);
routerAPI.get('/products/similar/:id', getSimilarProducts);
routerAPI.get('/products/trending', getTrendingProducts);
routerAPI.get('/products/facets', getSearchFacets);
routerAPI.get('/products/search-typo', searchWithTypoTolerance);
routerAPI.get('/products/:id', getProductById);
routerAPI.get('/categories/:categoryId/products', getProductsByCategory);

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

// Favorite products routes
routerAPI.post('/favorites/:productId', addToFavoritesController);
routerAPI.delete('/favorites/:productId', removeFromFavoritesController);
routerAPI.get('/favorites', getFavoriteProductsController);
routerAPI.get('/favorites/:productId/check', isFavoriteController);

// Viewed products routes
routerAPI.post('/viewed-products/:productId', addToViewedProductsController);
routerAPI.get('/viewed-products', getViewedProductsController);
routerAPI.delete('/viewed-products/:productId', removeFromViewedProductsController);
routerAPI.delete('/viewed-products', clearViewedProductsController);

// Comments routes
routerAPI.post('/products/:productId/comments', createCommentController);
routerAPI.get('/products/:productId/comments', getProductCommentsController);
routerAPI.put('/comments/:commentId', updateCommentController);
routerAPI.delete('/comments/:commentId', deleteCommentController);
routerAPI.post('/comments/:commentId/like', toggleCommentLikeController);

// Purchase routes
routerAPI.post('/purchases', createPurchaseController);
routerAPI.put('/purchases/:purchaseId/status', updatePurchaseStatusController);
routerAPI.get('/purchases', getUserPurchasesController);
routerAPI.get('/purchases/:purchaseId', getPurchaseByIdController);
routerAPI.get('/products/:productId/purchase-stats', getProductPurchaseStatsController);

// Cart routes
routerAPI.get('/cart', getUserCart);
routerAPI.post('/cart/add', addItemToCart);
routerAPI.put('/cart/update', updateCartItemQuantity);
routerAPI.delete('/cart/remove/:productId', removeItemFromCart);
routerAPI.delete('/cart/clear', clearUserCart);
routerAPI.get('/cart/count', getCartCount);

module.exports = routerAPI;