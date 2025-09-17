const {
    createComment,
    getProductComments,
    updateComment,
    deleteComment,
    toggleCommentLike
} = require('../services/commentService');

// Tạo comment mới
const createCommentController = async (req, res) => {
    const { productId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user.id;

    if (!content || !rating) {
        return res.status(400).json({
            EC: 1,
            EM: 'Nội dung và đánh giá là bắt buộc',
            DT: null
        });
    }

    const result = await createComment(userId, productId, content, rating);
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

// Lấy danh sách comment của sản phẩm
const getProductCommentsController = async (req, res) => {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await getProductComments(productId, parseInt(page), parseInt(limit));
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

// Cập nhật comment
const updateCommentController = async (req, res) => {
    const { commentId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user.id;

    if (!content || !rating) {
        return res.status(400).json({
            EC: 1,
            EM: 'Nội dung và đánh giá là bắt buộc',
            DT: null
        });
    }

    const result = await updateComment(commentId, userId, content, rating);
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

// Xóa comment
const deleteCommentController = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    const result = await deleteComment(commentId, userId);
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

// Like/Unlike comment
const toggleCommentLikeController = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    const result = await toggleCommentLike(commentId, userId);
    return res.status(result.EC === 0 ? 200 : 400).json(result);
};

module.exports = {
    createCommentController,
    getProductCommentsController,
    updateCommentController,
    deleteCommentController,
    toggleCommentLikeController
};
