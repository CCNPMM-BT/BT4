const {
    addToFavorites,
    removeFromFavorites,
    getFavoriteProducts,
    isFavorite
} = require('../services/favoriteService');

// Thêm sản phẩm vào danh sách yêu thích
const addToFavoritesController = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    const result = await addToFavorites(userId, productId);
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

// Xóa sản phẩm khỏi danh sách yêu thích
const removeFromFavoritesController = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    const result = await removeFromFavorites(userId, productId);
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

// Lấy danh sách sản phẩm yêu thích
const getFavoriteProductsController = async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 12 } = req.query;

    const result = await getFavoriteProducts(userId, parseInt(page), parseInt(limit));
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

// Kiểm tra sản phẩm có trong danh sách yêu thích không
const isFavoriteController = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    const result = await isFavorite(userId, productId);
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

module.exports = {
    addToFavoritesController,
    removeFromFavoritesController,
    getFavoriteProductsController,
    isFavoriteController
};
