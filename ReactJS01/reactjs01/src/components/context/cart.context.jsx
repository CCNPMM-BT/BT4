import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './auth.context';
import { 
    getCartApi,
    addToCartApi,
    updateCartItemApi,
    removeFromCartApi,
    clearCartApi,
    getCartCountApi
} from '../../util/apis';

const CartContext = createContext({
    cart: null,
    cartCount: 0,
    loading: false,
    addToCart: () => {},
    updateCartItem: () => {},
    removeFromCart: () => {},
    clearCart: () => {},
    refreshCart: () => {}
});

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { auth } = useContext(AuthContext);
    const [cart, setCart] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Lấy giỏ hàng
    const fetchCart = async () => {
        if (!auth.isAuthenticated) {
            setCart(null);
            setCartCount(0);
            return;
        }

        try {
            setLoading(true);
            const response = await getCartApi();
            if (response && response.EC === 0) {
                setCart(response.DT);
                setCartCount(response.DT?.totalItems || 0);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    // Lấy số lượng giỏ hàng
    const fetchCartCount = async () => {
        if (!auth.isAuthenticated) {
            setCartCount(0);
            return;
        }

        try {
            const response = await getCartCountApi();
            if (response && response.EC === 0) {
                setCartCount(response.DT?.count || 0);
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    };

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = async (productId, quantity = 1) => {
        if (!auth.isAuthenticated) {
            throw new Error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        }

        try {
            setLoading(true);
            const response = await addToCartApi(productId, quantity);
            if (response && response.EC === 0) {
                setCart(response.DT);
                setCartCount(response.DT?.totalItems || 0);
                return response;
            } else {
                throw new Error(response?.EM || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    const updateCartItem = async (productId, quantity) => {
        if (!auth.isAuthenticated) {
            throw new Error('Vui lòng đăng nhập để cập nhật giỏ hàng');
        }

        try {
            setLoading(true);
            const response = await updateCartItemApi(productId, quantity);
            if (response && response.EC === 0) {
                setCart(response.DT);
                setCartCount(response.DT?.totalItems || 0);
                return response;
            } else {
                throw new Error(response?.EM || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = async (productId) => {
        if (!auth.isAuthenticated) {
            throw new Error('Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng');
        }

        try {
            setLoading(true);
            const response = await removeFromCartApi(productId);
            if (response && response.EC === 0) {
                setCart(response.DT);
                setCartCount(response.DT?.totalItems || 0);
                return response;
            } else {
                throw new Error(response?.EM || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Xóa toàn bộ giỏ hàng
    const clearCart = async () => {
        if (!auth.isAuthenticated) {
            throw new Error('Vui lòng đăng nhập để xóa giỏ hàng');
        }

        try {
            setLoading(true);
            const response = await clearCartApi();
            if (response && response.EC === 0) {
                setCart(response.DT);
                setCartCount(0);
                return response;
            } else {
                throw new Error(response?.EM || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Làm mới giỏ hàng
    const refreshCart = async () => {
        await fetchCart();
    };

    // Effect để fetch cart khi user đăng nhập
    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchCart();
        } else {
            setCart(null);
            setCartCount(0);
        }
    }, [auth.isAuthenticated]);

    const value = {
        cart,
        cartCount,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
