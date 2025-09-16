const { 
    getProductsByCategoryService, 
    getAllProductsService, 
    getProductByIdService, 
    createProductService,
    updateProductService,
    deleteProductService,
    incrementProductViewsService,
    getRelatedProductsService,
    getProductReviewsService,
    createProductReviewService,
    toggleFavoriteService,
    checkFavoriteStatusService
} = require('../services/productService');
const elasticsearchService = require('../services/elasticsearchService');

const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    
    const data = await getProductsByCategoryService(categoryId, parseInt(page), parseInt(limit));
    return res.status(200).json(data);
};

const getAllProducts = async (req, res) => {
    const { page = 1, limit = 12, search = '' } = req.query;
    
    const data = await getAllProductsService(parseInt(page), parseInt(limit), search);
    return res.status(200).json(data);
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    const data = await getProductByIdService(id);
    
    // Increment views when product is viewed
    if (data.EC === 0) {
        await incrementProductViewsService(id);
    }
    
    return res.status(200).json(data);
};

const createProduct = async (req, res) => {
    const productData = req.body;
    const data = await createProductService(productData);
    return res.status(200).json(data);
};

// Advanced search with Elasticsearch
const searchProducts = async (req, res) => {
    try {
        const {
            q: query = '',
            category,
            minPrice,
            maxPrice,
            minDiscount,
            maxDiscount,
            minRating,
            minViews,
            tags,
            sortBy = 'relevance',
            sortOrder = 'desc',
            page = 1,
            limit = 12
        } = req.query;

        const filters = {
            category,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            minDiscount: minDiscount ? parseFloat(minDiscount) : undefined,
            maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
            minRating: minRating ? parseFloat(minRating) : undefined,
            minViews: minViews ? parseInt(minViews) : undefined,
            tags: tags ? tags.split(',') : undefined,
            sortBy,
            sortOrder
        };

        const pagination = {
            page: parseInt(page),
            limit: parseInt(limit)
        };

        const result = await elasticsearchService.searchProducts(query, filters, pagination);
        
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
};

// Get search suggestions
const getSearchSuggestions = async (req, res) => {
    try {
        const { q: query } = req.query;
        
        if (!query || query.trim().length < 2) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        const suggestions = await elasticsearchService.getSuggestions(query.trim());
        
        return res.status(200).json({
            success: true,
            data: suggestions
        });
    } catch (error) {
        console.error('Suggestions error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get suggestions',
            error: error.message
        });
    }
};

// Get popular searches
const getPopularSearches = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const popularSearches = await elasticsearchService.getPopularSearches(parseInt(limit));
        
        return res.status(200).json({
            success: true,
            data: popularSearches
        });
    } catch (error) {
        console.error('Popular searches error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get popular searches',
            error: error.message
        });
    }
};

// Get filter options (categories, price range, etc.)
const getFilterOptions = async (req, res) => {
    try {
        const [categoryStats, priceRange] = await Promise.all([
            elasticsearchService.getCategoryStats(),
            elasticsearchService.getPriceRange()
        ]);
        
        return res.status(200).json({
            success: true,
            data: {
                categories: categoryStats,
                priceRange
            }
        });
    } catch (error) {
        console.error('Filter options error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get filter options',
            error: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const data = await updateProductService(id, updateData);
    return res.status(200).json(data);
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const data = await deleteProductService(id);
    return res.status(200).json(data);
};

// Get related products
const getRelatedProducts = async (req, res) => {
    const { id } = req.params;
    const { limit = 4 } = req.query;
    const data = await getRelatedProductsService(id, parseInt(limit));
    return res.status(200).json(data);
};

// Get product reviews
const getProductReviews = async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const data = await getProductReviewsService(id, parseInt(page), parseInt(limit));
    return res.status(200).json(data);
};

// Create product review
const createProductReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id; // Assuming user is authenticated
    
    if (!userId) {
        return res.status(401).json({ EC: 1, EM: 'Authentication required' });
    }
    
    const data = await createProductReviewService(id, userId, { rating, comment });
    return res.status(200).json(data);
};

// Toggle favorite
const toggleFavorite = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id; // Assuming user is authenticated
    
    if (!userId) {
        return res.status(401).json({ EC: 1, EM: 'Authentication required' });
    }
    
    const data = await toggleFavoriteService(id, userId);
    return res.status(200).json(data);
};

// Check favorite status
const checkFavoriteStatus = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id; // Assuming user is authenticated
    
    if (!userId) {
        return res.status(401).json({ EC: 1, EM: 'Authentication required' });
    }
    
    const data = await checkFavoriteStatusService(id, userId);
    return res.status(200).json(data);
};

module.exports = {
    getProductsByCategory,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getSearchSuggestions,
    getPopularSearches,
    getFilterOptions,
    getRelatedProducts,
    getProductReviews,
    createProductReview,
    toggleFavorite,
    checkFavoriteStatus
};

