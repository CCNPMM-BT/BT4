const Product = require('../models/product');
const Category = require('../models/category');

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

        return { EC: 0, EM: 'Create product successfully', DT: product };
    } catch (error) {
        console.log('Error in createProductService:', error);
        return { EC: -1, EM: 'Failed to create product' };
    }
};

module.exports = {
    getProductsByCategoryService,
    getAllProductsService,
    getProductByIdService,
    createProductService
};
