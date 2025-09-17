const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likeCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for better query performance
commentSchema.index({ product: 1, createdAt: -1 });
commentSchema.index({ user: 1, createdAt: -1 });

// Middleware to update like count
commentSchema.pre('save', function(next) {
    this.likeCount = this.likes.length;
    next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
