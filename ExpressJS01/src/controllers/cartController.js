const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount
} = require('../services/cartService');

// Lấy giỏ hàng của user
const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await getCart(userId);
        
        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error in getUserCart controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Có lỗi xảy ra ở server',
            DT: null
        });
    }
};

// Thêm sản phẩm vào giỏ hàng
const addItemToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                EC: 1,
                EM: 'Thiếu thông tin sản phẩm',
                DT: null
            });
        }

        const result = await addToCart(userId, productId, quantity);
        
        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error in addItemToCart controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Có lỗi xảy ra ở server',
            DT: null
        });
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItemQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                EC: 1,
                EM: 'Thiếu thông tin sản phẩm hoặc số lượng',
                DT: null
            });
        }

        const result = await updateCartItem(userId, productId, quantity);
        
        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error in updateCartItemQuantity controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Có lỗi xảy ra ở server',
            DT: null
        });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeItemFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                EC: 1,
                EM: 'Thiếu thông tin sản phẩm',
                DT: null
            });
        }

        const result = await removeFromCart(userId, productId);
        
        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error in removeItemFromCart controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Có lỗi xảy ra ở server',
            DT: null
        });
    }
};

// Xóa toàn bộ giỏ hàng
const clearUserCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await clearCart(userId);
        
        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error in clearUserCart controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Có lỗi xảy ra ở server',
            DT: null
        });
    }
};

// Lấy số lượng sản phẩm trong giỏ hàng
const getCartCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await getCartItemCount(userId);
        
        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error in getCartCount controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Có lỗi xảy ra ở server',
            DT: null
        });
    }
};

module.exports = {
    getUserCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    clearUserCart,
    getCartCount
};
