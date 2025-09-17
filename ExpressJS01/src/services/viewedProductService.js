const User = require('../models/user');
const Product = require('../models/product');

// Thêm sản phẩm vào danh sách đã xem
const addToViewedProducts = async (userId, productId) => {
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

        // Kiểm tra sản phẩm đã có trong danh sách đã xem chưa
        const existingView = user.viewedProducts.find(
            view => view.product.toString() === productId
        );

        if (existingView) {
            // Cập nhật thời gian xem
            existingView.viewedAt = new Date();
        } else {
            // Thêm sản phẩm mới vào danh sách đã xem
            user.viewedProducts.push({
                product: productId,
                viewedAt: new Date()
            });
        }

        // Giới hạn số lượng sản phẩm đã xem (giữ lại 50 sản phẩm gần nhất)
        if (user.viewedProducts.length > 50) {
            user.viewedProducts = user.viewedProducts
                .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
                .slice(0, 50);
        }

        await user.save();

        // Cập nhật số lượng lượt xem của sản phẩm
        product.viewCount += 1;
        await product.save();

        return {
            EC: 0,
            EM: 'Đã thêm sản phẩm vào danh sách đã xem',
            DT: {
                productId,
                viewCount: product.viewCount
            }
        };
    } catch (error) {
        console.error('Error adding to viewed products:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi thêm vào danh sách đã xem',
            DT: null
        };
    }
};

// Lấy danh sách sản phẩm đã xem
const getViewedProducts = async (userId, page = 1, limit = 12) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return {
                EC: 1,
                EM: 'Người dùng không tồn tại',
                DT: null
            };
        }

        // Sắp xếp theo thời gian xem gần nhất
        const sortedViewedProducts = user.viewedProducts
            .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt));

        // Phân trang
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedViewedProducts = sortedViewedProducts.slice(startIndex, endIndex);

        // Populate thông tin sản phẩm
        const productIds = paginatedViewedProducts.map(view => view.product);
        const products = await Product.find({ _id: { $in: productIds } });

        // Tạo map để giữ thứ tự và thông tin thời gian xem
        const productMap = {};
        products.forEach(product => {
            productMap[product._id.toString()] = product;
        });

        const viewedProductsWithDetails = paginatedViewedProducts.map(view => {
            const product = productMap[view.product.toString()];
            return {
                ...product.toObject(),
                viewedAt: view.viewedAt
            };
        }).filter(product => product); // Lọc bỏ sản phẩm không tồn tại

        const totalViewed = user.viewedProducts.length;
        const totalPages = Math.ceil(totalViewed / limit);

        return {
            EC: 0,
            EM: 'Lấy danh sách sản phẩm đã xem thành công',
            DT: {
                products: viewedProductsWithDetails,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: totalViewed,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        };
    } catch (error) {
        console.error('Error getting viewed products:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi lấy danh sách sản phẩm đã xem',
            DT: null
        };
    }
};

// Xóa sản phẩm khỏi danh sách đã xem
const removeFromViewedProducts = async (userId, productId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return {
                EC: 1,
                EM: 'Người dùng không tồn tại',
                DT: null
            };
        }

        // Xóa sản phẩm khỏi danh sách đã xem
        user.viewedProducts = user.viewedProducts.filter(
            view => view.product.toString() !== productId
        );
        await user.save();

        return {
            EC: 0,
            EM: 'Đã xóa sản phẩm khỏi danh sách đã xem',
            DT: {
                productId
            }
        };
    } catch (error) {
        console.error('Error removing from viewed products:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi xóa khỏi danh sách đã xem',
            DT: null
        };
    }
};

// Xóa tất cả sản phẩm đã xem
const clearViewedProducts = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return {
                EC: 1,
                EM: 'Người dùng không tồn tại',
                DT: null
            };
        }

        user.viewedProducts = [];
        await user.save();

        return {
            EC: 0,
            EM: 'Đã xóa tất cả sản phẩm đã xem',
            DT: null
        };
    } catch (error) {
        console.error('Error clearing viewed products:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi xóa tất cả sản phẩm đã xem',
            DT: null
        };
    }
};

module.exports = {
    addToViewedProducts,
    getViewedProducts,
    removeFromViewedProducts,
    clearViewedProducts
};
