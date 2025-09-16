const Product = require('../models/product');
const Category = require('../models/category');
const Review = require('../models/review');
const Favorite = require('../models/favorite');
const User = require('../models/user');
const { indexProduct, updateProduct, deleteProduct } = require('../config/elasticsearch');

const getProductsByCategoryService = async (categoryId, page = 1, limit = 12) => {
    try {
        const skip = (page - 1) * limit;
        
        // Kiểm tra category có tồn tại không
        const category = await Category.findById(categoryId);
        if (!category) {
            return { EC: 1, EM: 'Category not found' };
        }

        // Lấy products với pagination
        const products = await Product.find({ 
            category: categoryId, 
            isActive: true 
        })
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        // Đếm tổng số products
        const totalProducts = await Product.countDocuments({ 
            category: categoryId, 
            isActive: true 
        });

        const totalPages = Math.ceil(totalProducts / limit);

        return {
            EC: 0,
            EM: 'Get products successfully',
            DT: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        };
    } catch (error) {
        console.log('Error in getProductsByCategoryService:', error);
        return { EC: -1, EM: 'Failed to get products' };
    }
};

const getAllProductsService = async (page = 1, limit = 12, search = '') => {
    try {
        const skip = (page - 1) * limit;
        let query = { isActive: true };

        // Thêm tìm kiếm theo tên sản phẩm
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query)
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        return {
            EC: 0,
            EM: 'Get products successfully',
            DT: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        };
    } catch (error) {
        console.log('Error in getAllProductsService:', error);
        return { EC: -1, EM: 'Failed to get products' };
    }
};

const getProductByIdService = async (productId) => {
    try {
        const product = await Product.findById(productId).populate('category', 'name');
        if (!product) {
            return { EC: 1, EM: 'Product not found' };
        }
        return { EC: 0, EM: 'Get product successfully', DT: product };
    } catch (error) {
        console.log('Error in getProductByIdService:', error);
        return { EC: -1, EM: 'Failed to get product' };
    }
};

const createProductService = async (productData) => {
    try {
        const { name, description, price, originalPrice, images, category, stock, tags } = productData;

        // Kiểm tra category có tồn tại không
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return { EC: 1, EM: 'Category not found' };
        }

        const product = await Product.create({
            name,
            description,
            price,
            originalPrice,
            images,
            category,
            stock,
            tags
        });

        await product.populate('category', 'name');

        // Index to Elasticsearch
        try {
            await indexProduct(product);
        } catch (esError) {
            console.error('Failed to index product to Elasticsearch:', esError);
        }

        return { EC: 0, EM: 'Create product successfully', DT: product };
    } catch (error) {
        console.log('Error in createProductService:', error);
        return { EC: -1, EM: 'Failed to create product' };
    }
};

const updateProductService = async (productId, updateData) => {
    try {
        const product = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true, runValidators: true }
        ).populate('category', 'name');

        if (!product) {
            return { EC: 1, EM: 'Product not found' };
        }

        // Update in Elasticsearch
        try {
            await updateProduct(productId, product);
        } catch (esError) {
            console.error('Failed to update product in Elasticsearch:', esError);
        }

        return { EC: 0, EM: 'Update product successfully', DT: product };
    } catch (error) {
        console.log('Error in updateProductService:', error);
        return { EC: -1, EM: 'Failed to update product' };
    }
};

const deleteProductService = async (productId) => {
    try {
        const product = await Product.findByIdAndUpdate(
            productId,
            { isActive: false },
            { new: true }
        );

        if (!product) {
            return { EC: 1, EM: 'Product not found' };
        }

        // Delete from Elasticsearch
        try {
            await deleteProduct(productId);
        } catch (esError) {
            console.error('Failed to delete product from Elasticsearch:', esError);
        }

        return { EC: 0, EM: 'Delete product successfully', DT: product };
    } catch (error) {
        console.log('Error in deleteProductService:', error);
        return { EC: -1, EM: 'Failed to delete product' };
    }
};

const incrementProductViewsService = async (productId) => {
    try {
        const product = await Product.findByIdAndUpdate(
            productId,
            { $inc: { viewCount: 1 } },
            { new: true }
        ).populate('category', 'name');

        if (!product) {
            return { EC: 1, EM: 'Product not found' };
        }

        // Update views in Elasticsearch
        try {
            await updateProduct(productId, product);
        } catch (esError) {
            console.error('Failed to update product views in Elasticsearch:', esError);
        }

        return { EC: 0, EM: 'Increment views successfully', DT: product };
    } catch (error) {
        console.log('Error in incrementProductViewsService:', error);
        return { EC: -1, EM: 'Failed to increment views' };
    }
};

const getRelatedProductsService = async (productId, limit = 4) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return { EC: 1, EM: 'Product not found' };
        }

        const relatedProducts = await Product.find({
            _id: { $ne: productId },
            category: product.category,
            isActive: true
        })
        .populate('category', 'name')
        .sort({ rating: -1, viewCount: -1 })
        .limit(limit);

        return { EC: 0, EM: 'Get related products successfully', DT: relatedProducts };
    } catch (error) {
        console.log('Error in getRelatedProductsService:', error);
        return { EC: -1, EM: 'Failed to get related products' };
    }
};

const getProductReviewsService = async (productId, page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;
        
        const reviews = await Review.find({ product: productId })
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalReviews = await Review.countDocuments({ product: productId });
        const totalPages = Math.ceil(totalReviews / limit);

        // Tính rating trung bình
        const avgRating = await Review.aggregate([
            { $match: { product: productId } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);

        return {
            EC: 0,
            EM: 'Get reviews successfully',
            DT: {
                reviews,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalReviews,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                },
                avgRating: avgRating.length > 0 ? avgRating[0].avgRating : 0
            }
        };
    } catch (error) {
        console.log('Error in getProductReviewsService:', error);
        return { EC: -1, EM: 'Failed to get reviews' };
    }
};

const createProductReviewService = async (productId, userId, reviewData) => {
    try {
        const { rating, comment } = reviewData;

        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findById(productId);
        if (!product) {
            return { EC: 1, EM: 'Product not found' };
        }

        // Kiểm tra user đã review chưa
        const existingReview = await Review.findOne({ product: productId, user: userId });
        if (existingReview) {
            return { EC: 1, EM: 'You have already reviewed this product' };
        }

        // Tạo review
        const review = await Review.create({
            product: productId,
            user: userId,
            rating,
            comment
        });

        await review.populate('user', 'name');

        // Cập nhật rating và reviewCount của sản phẩm
        const avgRating = await Review.aggregate([
            { $match: { product: productId } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);

        const reviewCount = await Review.countDocuments({ product: productId });

        await Product.findByIdAndUpdate(productId, {
            rating: avgRating.length > 0 ? avgRating[0].avgRating : 0,
            reviewCount
        });

        return { EC: 0, EM: 'Create review successfully', DT: review };
    } catch (error) {
        console.log('Error in createProductReviewService:', error);
        return { EC: -1, EM: 'Failed to create review' };
    }
};

const toggleFavoriteService = async (productId, userId) => {
    try {
        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findById(productId);
        if (!product) {
            return { EC: 1, EM: 'Product not found' };
        }

        // Kiểm tra đã favorite chưa
        const existingFavorite = await Favorite.findOne({ product: productId, user: userId });
        
        if (existingFavorite) {
            // Bỏ favorite
            await Favorite.findByIdAndDelete(existingFavorite._id);
            await Product.findByIdAndUpdate(productId, { $inc: { favoriteCount: -1 } });
            return { EC: 0, EM: 'Removed from favorites', DT: { isFavorite: false } };
        } else {
            // Thêm favorite
            await Favorite.create({ product: productId, user: userId });
            await Product.findByIdAndUpdate(productId, { $inc: { favoriteCount: 1 } });
            return { EC: 0, EM: 'Added to favorites', DT: { isFavorite: true } };
        }
    } catch (error) {
        console.log('Error in toggleFavoriteService:', error);
        return { EC: -1, EM: 'Failed to toggle favorite' };
    }
};

const checkFavoriteStatusService = async (productId, userId) => {
    try {
        const favorite = await Favorite.findOne({ product: productId, user: userId });
        return { EC: 0, EM: 'Check favorite status successfully', DT: { isFavorite: !!favorite } };
    } catch (error) {
        console.log('Error in checkFavoriteStatusService:', error);
        return { EC: -1, EM: 'Failed to check favorite status' };
    }
};

module.exports = {
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
};
