const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        maxlength: 1000
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    helpfulCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index để đảm bảo mỗi user chỉ review 1 lần cho 1 sản phẩm
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
