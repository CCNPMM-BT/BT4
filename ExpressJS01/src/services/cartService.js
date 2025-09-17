const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');

// Lấy giỏ hàng của user
const getCart = async (userId) => {
    try {
        let cart = await Cart.findOne({ user: userId, isActive: true })
            .populate('items.product', 'name price originalPrice discount images isActive stock');

        if (!cart) {
            // Tạo giỏ hàng mới nếu chưa có
            cart = new Cart({
                user: userId,
                items: [],
                totalItems: 0,
                totalAmount: 0
            });
            await cart.save();
        }

        // Lọc bỏ sản phẩm không còn hoạt động
        const activeItems = cart.items.filter(item => 
            item.product && item.product.isActive && item.product.stock > 0
        );

        if (activeItems.length !== cart.items.length) {
            cart.items = activeItems;
            await cart.save();
        }

        return {
            EC: 0,
            EM: 'Lấy giỏ hàng thành công',
            DT: cart
        };
    } catch (error) {
        console.error('Error getting cart:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi lấy giỏ hàng',
            DT: null
        };
    }
};

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (userId, productId, quantity = 1) => {
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

        if (!product.isActive) {
            return {
                EC: 1,
                EM: 'Sản phẩm không còn hoạt động',
                DT: null
            };
        }

        if (product.stock < quantity) {
            return {
                EC: 1,
                EM: 'Số lượng sản phẩm không đủ',
                DT: null
            };
        }

        // Lấy hoặc tạo giỏ hàng
        let cart = await Cart.findOne({ user: userId, isActive: true });
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],
                totalItems: 0,
                totalAmount: 0
            });
        }

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        const currentPrice = product.discount > 0 ? 
            product.price * (1 - product.discount / 100) : 
            product.price;

        if (existingItemIndex > -1) {
            // Cập nhật số lượng nếu đã có
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            
            if (newQuantity > product.stock) {
                return {
                    EC: 1,
                    EM: 'Số lượng sản phẩm vượt quá tồn kho',
                    DT: null
                };
            }

            cart.items[existingItemIndex].quantity = newQuantity;
            cart.items[existingItemIndex].totalPrice = newQuantity * currentPrice;
        } else {
            // Thêm sản phẩm mới
            cart.items.push({
                product: productId,
                quantity: quantity,
                price: currentPrice,
                totalPrice: quantity * currentPrice
            });
        }

        await cart.save();

        // Populate để trả về thông tin đầy đủ
        const populatedCart = await Cart.findById(cart._id)
            .populate('items.product', 'name price originalPrice discount images isActive stock');

        return {
            EC: 0,
            EM: 'Thêm sản phẩm vào giỏ hàng thành công',
            DT: populatedCart
        };
    } catch (error) {
        console.error('Error adding to cart:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng',
            DT: null
        };
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItem = async (userId, productId, quantity) => {
    try {
        if (quantity < 1) {
            return {
                EC: 1,
                EM: 'Số lượng phải lớn hơn 0',
                DT: null
            };
        }

        const cart = await Cart.findOne({ user: userId, isActive: true });
        if (!cart) {
            return {
                EC: 1,
                EM: 'Giỏ hàng không tồn tại',
                DT: null
            };
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return {
                EC: 1,
                EM: 'Sản phẩm không có trong giỏ hàng',
                DT: null
            };
        }

        // Kiểm tra tồn kho
        const product = await Product.findById(productId);
        if (!product || quantity > product.stock) {
            return {
                EC: 1,
                EM: 'Số lượng sản phẩm vượt quá tồn kho',
                DT: null
            };
        }

        // Cập nhật số lượng
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].totalPrice = quantity * cart.items[itemIndex].price;

        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate('items.product', 'name price originalPrice discount images isActive stock');

        return {
            EC: 0,
            EM: 'Cập nhật giỏ hàng thành công',
            DT: populatedCart
        };
    } catch (error) {
        console.error('Error updating cart item:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi cập nhật giỏ hàng',
            DT: null
        };
    }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (userId, productId) => {
    try {
        const cart = await Cart.findOne({ user: userId, isActive: true });
        if (!cart) {
            return {
                EC: 1,
                EM: 'Giỏ hàng không tồn tại',
                DT: null
            };
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return {
                EC: 1,
                EM: 'Sản phẩm không có trong giỏ hàng',
                DT: null
            };
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate('items.product', 'name price originalPrice discount images isActive stock');

        return {
            EC: 0,
            EM: 'Xóa sản phẩm khỏi giỏ hàng thành công',
            DT: populatedCart
        };
    } catch (error) {
        console.error('Error removing from cart:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng',
            DT: null
        };
    }
};

// Xóa toàn bộ giỏ hàng
const clearCart = async (userId) => {
    try {
        const cart = await Cart.findOne({ user: userId, isActive: true });
        if (!cart) {
            return {
                EC: 1,
                EM: 'Giỏ hàng không tồn tại',
                DT: null
            };
        }

        cart.items = [];
        await cart.save();

        return {
            EC: 0,
            EM: 'Xóa toàn bộ giỏ hàng thành công',
            DT: cart
        };
    } catch (error) {
        console.error('Error clearing cart:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi xóa giỏ hàng',
            DT: null
        };
    }
};

// Lấy số lượng sản phẩm trong giỏ hàng
const getCartItemCount = async (userId) => {
    try {
        const cart = await Cart.findOne({ user: userId, isActive: true });
        if (!cart) {
            return {
                EC: 0,
                EM: 'Lấy số lượng giỏ hàng thành công',
                DT: { count: 0 }
            };
        }

        return {
            EC: 0,
            EM: 'Lấy số lượng giỏ hàng thành công',
            DT: { count: cart.totalItems }
        };
    } catch (error) {
        console.error('Error getting cart item count:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi lấy số lượng giỏ hàng',
            DT: null
        };
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount
};
