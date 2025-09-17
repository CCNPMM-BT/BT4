const {
    addToViewedProducts,
    getViewedProducts,
    removeFromViewedProducts,
    clearViewedProducts
} = require('../services/viewedProductService');

// Thêm sản phẩm vào danh sách đã xem
const addToViewedProductsController = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    const result = await addToViewedProducts(userId, productId);
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

// Lấy danh sách sản phẩm đã xem
const getViewedProductsController = async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 12 } = req.query;

    const result = await getViewedProducts(userId, parseInt(page), parseInt(limit));
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

// Xóa sản phẩm khỏi danh sách đã xem
const removeFromViewedProductsController = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    const result = await removeFromViewedProducts(userId, productId);
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

// Xóa tất cả sản phẩm đã xem
const clearViewedProductsController = async (req, res) => {
    const userId = req.user.id;

    const result = await clearViewedProducts(userId);
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

module.exports = {
    addToViewedProductsController,
    getViewedProductsController,
    removeFromViewedProductsController,
    clearViewedProductsController
};
