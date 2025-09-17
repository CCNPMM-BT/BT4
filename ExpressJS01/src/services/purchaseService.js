const Purchase = require('../models/purchase');
const Product = require('../models/product');
const User = require('../models/user');

// Tạo đơn hàng mới
const createPurchase = async (purchaseData) => {
    try {
        const { userId, productId, quantity, paymentMethod, shippingAddress, notes } = purchaseData;

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

        // Kiểm tra số lượng tồn kho
        if (product.stock < quantity) {
            return {
                EC: 1,
                EM: 'Số lượng sản phẩm không đủ',
                DT: null
            };
        }

        // Tính tổng tiền
        const totalAmount = product.price * quantity;

        // Tạo đơn hàng mới
        const purchase = new Purchase({
            user: userId,
            product: productId,
            quantity,
            price: product.price,
            totalAmount,
            paymentMethod,
            shippingAddress,
            notes
        });

        await purchase.save();

        // Cập nhật số lượng tồn kho
        product.stock -= quantity;
        await product.save();

        // Populate thông tin
        await purchase.populate('product', 'name price images');
        await purchase.populate('user', 'name email');

        return {
            EC: 0,
            EM: 'Tạo đơn hàng thành công',
            DT: purchase
        };
    } catch (error) {
        console.error('Error creating purchase:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi tạo đơn hàng',
            DT: null
        };
    }
};

// Cập nhật trạng thái đơn hàng
const updatePurchaseStatus = async (purchaseId, status) => {
    try {
        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) {
            return {
                EC: 1,
                EM: 'Đơn hàng không tồn tại',
                DT: null
            };
        }

        purchase.status = status;
        await purchase.save();

        // Nếu đơn hàng được hoàn thành, cập nhật số lượng mua của sản phẩm
        if (status === 'completed') {
            const product = await Product.findById(purchase.product);
            if (product) {
                product.purchaseCount += purchase.quantity;
                await product.save();
            }
        }

        return {
            EC: 0,
            EM: 'Cập nhật trạng thái đơn hàng thành công',
            DT: purchase
        };
    } catch (error) {
        console.error('Error updating purchase status:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng',
            DT: null
        };
    }
};

// Lấy danh sách đơn hàng của user
const getUserPurchases = async (userId, page = 1, limit = 10) => {
    try {
        const purchases = await Purchase.find({ user: userId })
            .populate('product', 'name price images')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPurchases = await Purchase.countDocuments({ user: userId });
        const totalPages = Math.ceil(totalPurchases / limit);

        return {
            EC: 0,
            EM: 'Lấy danh sách đơn hàng thành công',
            DT: {
                purchases,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: totalPurchases,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        };
    } catch (error) {
        console.error('Error getting user purchases:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi lấy danh sách đơn hàng',
            DT: null
        };
    }
};

// Lấy thống kê mua hàng của sản phẩm
const getProductPurchaseStats = async (productId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return {
                EC: 1,
                EM: 'Sản phẩm không tồn tại',
                DT: null
            };
        }

        const totalPurchases = await Purchase.countDocuments({ 
            product: productId, 
            status: 'completed' 
        });

        const totalQuantitySold = await Purchase.aggregate([
            { $match: { product: product._id, status: 'completed' } },
            { $group: { _id: null, totalQuantity: { $sum: '$quantity' } } }
        ]);

        const totalRevenue = await Purchase.aggregate([
            { $match: { product: product._id, status: 'completed' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ]);

        return {
            EC: 0,
            EM: 'Lấy thống kê mua hàng thành công',
            DT: {
                productId,
                purchaseCount: product.purchaseCount,
                totalPurchases,
                totalQuantitySold: totalQuantitySold[0]?.totalQuantity || 0,
                totalRevenue: totalRevenue[0]?.totalRevenue || 0
            }
        };
    } catch (error) {
        console.error('Error getting product purchase stats:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi lấy thống kê mua hàng',
            DT: null
        };
    }
};

// Lấy đơn hàng theo ID
const getPurchaseById = async (purchaseId) => {
    try {
        const purchase = await Purchase.findById(purchaseId)
            .populate('product', 'name price images')
            .populate('user', 'name email');

        if (!purchase) {
            return {
                EC: 1,
                EM: 'Đơn hàng không tồn tại',
                DT: null
            };
        }

        return {
            EC: 0,
            EM: 'Lấy thông tin đơn hàng thành công',
            DT: purchase
        };
    } catch (error) {
        console.error('Error getting purchase by ID:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi lấy thông tin đơn hàng',
            DT: null
        };
    }
};

module.exports = {
    createPurchase,
    updatePurchaseStatus,
    getUserPurchases,
    getProductPurchaseStats,
    getPurchaseById
};
