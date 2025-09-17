const mongoose = require('mongoose');
const Comment = require('../models/comment');
const Product = require('../models/product');
const User = require('../models/user');

// Đảm bảo User model được đăng ký
if (!mongoose.models.User) {
    require('../models/user');
}

// Tạo comment mới
const createComment = async (userId, productId, content, rating) => {
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

        // Tạo comment mới
        const comment = new Comment({
            product: productId,
            user: userId,
            content,
            rating
        });

        await comment.save();

        // Cập nhật số lượng comment của sản phẩm
        product.commentCount += 1;
        
        // Cập nhật rating trung bình của sản phẩm
        const allComments = await Comment.find({ product: productId, isApproved: true });
        const totalRating = allComments.reduce((sum, c) => sum + c.rating, 0);
        product.rating = totalRating / allComments.length;
        product.reviewCount = allComments.length;
        
        await product.save();

        // Trả về comment với thông tin user cơ bản (không populate để tránh lỗi)
        const commentData = {
            _id: comment._id,
            product: comment.product,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            content: comment.content,
            rating: comment.rating,
            isApproved: comment.isApproved,
            parentComment: comment.parentComment,
            likes: comment.likes,
            likeCount: comment.likeCount,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt
        };

        return {
            EC: 0,
            EM: 'Tạo bình luận thành công',
            DT: commentData
        };
    } catch (error) {
        console.error('Error creating comment:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi tạo bình luận',
            DT: null
        };
    }
};

// Lấy danh sách comment của sản phẩm
const getProductComments = async (productId, page = 1, limit = 10) => {
    try {
        const comments = await Comment.find({ 
            product: productId, 
            isApproved: true 
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

        // Populate thông tin user thủ công để tránh lỗi
        const populatedComments = await Promise.all(comments.map(async (comment) => {
            const user = await User.findById(comment.user).select('name email');
            return {
                _id: comment._id,
                product: comment.product,
                user: {
                    _id: user?._id || comment.user,
                    name: user?.name || 'Unknown User',
                    email: user?.email || ''
                },
                content: comment.content,
                rating: comment.rating,
                isApproved: comment.isApproved,
                parentComment: comment.parentComment,
                likes: comment.likes,
                likeCount: comment.likeCount,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt
            };
        }));

        const totalComments = await Comment.countDocuments({ 
            product: productId, 
            isApproved: true 
        });

        const totalPages = Math.ceil(totalComments / limit);

        return {
            EC: 0,
            EM: 'Lấy danh sách bình luận thành công',
            DT: {
                comments: populatedComments,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: totalComments,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        };
    } catch (error) {
        console.error('Error getting product comments:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi lấy danh sách bình luận',
            DT: null
        };
    }
};

// Cập nhật comment
const updateComment = async (commentId, userId, content, rating) => {
    try {
        const comment = await Comment.findOne({ 
            _id: commentId, 
            user: userId 
        });

        if (!comment) {
            return {
                EC: 1,
                EM: 'Bình luận không tồn tại hoặc không có quyền chỉnh sửa',
                DT: null
            };
        }

        comment.content = content;
        comment.rating = rating;
        await comment.save();

        // Cập nhật rating trung bình của sản phẩm
        const product = await Product.findById(comment.product);
        if (product) {
            const allComments = await Comment.find({ 
                product: comment.product, 
                isApproved: true 
            });
            const totalRating = allComments.reduce((sum, c) => sum + c.rating, 0);
            product.rating = totalRating / allComments.length;
            await product.save();
        }

        return {
            EC: 0,
            EM: 'Cập nhật bình luận thành công',
            DT: comment
        };
    } catch (error) {
        console.error('Error updating comment:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi cập nhật bình luận',
            DT: null
        };
    }
};

// Xóa comment
const deleteComment = async (commentId, userId) => {
    try {
        const comment = await Comment.findOne({ 
            _id: commentId, 
            user: userId 
        });

        if (!comment) {
            return {
                EC: 1,
                EM: 'Bình luận không tồn tại hoặc không có quyền xóa',
                DT: null
            };
        }

        const productId = comment.product;
        await Comment.findByIdAndDelete(commentId);

        // Cập nhật số lượng comment của sản phẩm
        const product = await Product.findById(productId);
        if (product) {
            product.commentCount = Math.max(0, product.commentCount - 1);
            
            // Cập nhật rating trung bình
            const allComments = await Comment.find({ 
                product: productId, 
                isApproved: true 
            });
            
            if (allComments.length > 0) {
                const totalRating = allComments.reduce((sum, c) => sum + c.rating, 0);
                product.rating = totalRating / allComments.length;
                product.reviewCount = allComments.length;
            } else {
                product.rating = 0;
                product.reviewCount = 0;
            }
            
            await product.save();
        }

        return {
            EC: 0,
            EM: 'Xóa bình luận thành công',
            DT: null
        };
    } catch (error) {
        console.error('Error deleting comment:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi xóa bình luận',
            DT: null
        };
    }
};

// Like/Unlike comment
const toggleCommentLike = async (commentId, userId) => {
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return {
                EC: 1,
                EM: 'Bình luận không tồn tại',
                DT: null
            };
        }

        const userIndex = comment.likes.indexOf(userId);
        let isLiked = false;

        if (userIndex > -1) {
            // Unlike
            comment.likes.splice(userIndex, 1);
        } else {
            // Like
            comment.likes.push(userId);
            isLiked = true;
        }

        await comment.save();

        return {
            EC: 0,
            EM: isLiked ? 'Đã thích bình luận' : 'Đã bỏ thích bình luận',
            DT: {
                isLiked,
                likeCount: comment.likeCount
            }
        };
    } catch (error) {
        console.error('Error toggling comment like:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi thích/bỏ thích bình luận',
            DT: null
        };
    }
};

module.exports = {
    createComment,
    getProductComments,
    updateComment,
    deleteComment,
    toggleCommentLike
};
