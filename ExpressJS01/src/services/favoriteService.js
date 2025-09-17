const User = require('../models/user');
const Product = require('../models/product');

// Thêm sản phẩm vào danh sách yêu thích
const addToFavorites = async (userId, productId) => {
    try {
        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findById(productId);
        if (!product) {
            return {
                EC: 1,
                EM: 'Sản phẩm không tồn tại',
                DT: null
            };
        }

        // Kiểm tra user có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            return {
                EC: 1,
                EM: 'Người dùng không tồn tại',
                DT: null
            };
        }

        // Kiểm tra sản phẩm đã có trong danh sách yêu thích chưa
        if (user.favoriteProducts.includes(productId)) {
            return {
                EC: 1,
                EM: 'Sản phẩm đã có trong danh sách yêu thích',
                DT: null
            };
        }

        // Thêm sản phẩm vào danh sách yêu thích
        user.favoriteProducts.push(productId);
        await user.save();

        // Cập nhật số lượng yêu thích của sản phẩm
        product.favoriteCount += 1;
        await product.save();

        return {
            EC: 0,
            EM: 'Đã thêm sản phẩm vào danh sách yêu thích',
            DT: {
                productId,
                favoriteCount: product.favoriteCount
            }
        };
    } catch (error) {
        console.error('Error adding to favorites:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi thêm vào danh sách yêu thích',
            DT: null
        };
    }
};

// Xóa sản phẩm khỏi danh sách yêu thích
const removeFromFavorites = async (userId, productId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return {
                EC: 1,
                EM: 'Người dùng không tồn tại',
                DT: null
            };
        }

        // Kiểm tra sản phẩm có trong danh sách yêu thích không
        if (!user.favoriteProducts.includes(productId)) {
            return {
                EC: 1,
                EM: 'Sản phẩm không có trong danh sách yêu thích',
                DT: null
            };
        }

        // Xóa sản phẩm khỏi danh sách yêu thích
        user.favoriteProducts = user.favoriteProducts.filter(
            id => id.toString() !== productId
        );
        await user.save();

        // Cập nhật số lượng yêu thích của sản phẩm
        const product = await Product.findById(productId);
        if (product) {
            product.favoriteCount = Math.max(0, product.favoriteCount - 1);
            await product.save();
        }

        return {
            EC: 0,
            EM: 'Đã xóa sản phẩm khỏi danh sách yêu thích',
            DT: {
                productId,
                favoriteCount: product ? product.favoriteCount : 0
            }
        };
    } catch (error) {
        console.error('Error removing from favorites:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi xóa khỏi danh sách yêu thích',
            DT: null
        };
    }
};

// Lấy danh sách sản phẩm yêu thích
const getFavoriteProducts = async (userId, page = 1, limit = 12) => {
    try {
        const user = await User.findById(userId)
            .populate({
                path: 'favoriteProducts',
                options: {
                    skip: (page - 1) * limit,
                    limit: limit,
                    sort: { createdAt: -1 }
                }
            });

        if (!user) {
            return {
                EC: 1,
                EM: 'Người dùng không tồn tại',
                DT: null
            };
        }

        const totalFavorites = user.favoriteProducts.length;
        const totalPages = Math.ceil(totalFavorites / limit);

        return {
            EC: 0,
            EM: 'Lấy danh sách sản phẩm yêu thích thành công',
            DT: {
                products: user.favoriteProducts,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: totalFavorites,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        };
    } catch (error) {
        console.error('Error getting favorite products:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi lấy danh sách sản phẩm yêu thích',
            DT: null
        };
    }
};

// Kiểm tra sản phẩm có trong danh sách yêu thích không
const isFavorite = async (userId, productId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return {
                EC: 1,
                EM: 'Người dùng không tồn tại',
                DT: false
            };
        }

        const isFav = user.favoriteProducts.includes(productId);
        return {
            EC: 0,
            EM: 'Kiểm tra trạng thái yêu thích thành công',
            DT: isFav
        };
    } catch (error) {
        console.error('Error checking favorite status:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi kiểm tra trạng thái yêu thích',
            DT: false
        };
    }
};

module.exports = {
    addToFavorites,
    removeFromFavorites,
    getFavoriteProducts,
    isFavorite
};
