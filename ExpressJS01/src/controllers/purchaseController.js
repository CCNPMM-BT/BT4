const {
    createPurchase,
    updatePurchaseStatus,
    getUserPurchases,
    getProductPurchaseStats,
    getPurchaseById
} = require('../services/purchaseService');

// Tạo đơn hàng mới
const createPurchaseController = async (req, res) => {
    const purchaseData = {
        ...req.body,
        userId: req.user.id
    };

    const result = await createPurchase(purchaseData);
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

// Cập nhật trạng thái đơn hàng
const updatePurchaseStatusController = async (req, res) => {
    const { purchaseId } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            EC: 1,
            EM: 'Trạng thái đơn hàng là bắt buộc',
            DT: null
        });
    }

    const result = await updatePurchaseStatus(purchaseId, status);
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

// Lấy danh sách đơn hàng của user
const getUserPurchasesController = async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const result = await getUserPurchases(userId, parseInt(page), parseInt(limit));
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

// Lấy thống kê mua hàng của sản phẩm
const getProductPurchaseStatsController = async (req, res) => {
    const { productId } = req.params;

    const result = await getProductPurchaseStats(productId);
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

// Lấy đơn hàng theo ID
const getPurchaseByIdController = async (req, res) => {
    const { purchaseId } = req.params;

    const result = await getPurchaseById(purchaseId);
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

module.exports = {
    createPurchaseController,
    updatePurchaseStatusController,
    getUserPurchasesController,
    getProductPurchaseStatsController,
    getPurchaseByIdController
};
