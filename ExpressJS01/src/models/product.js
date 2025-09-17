const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true,
        min: 0
    },
    originalPrice: {
        type: Number,
        min: 0
    },
    images: [String],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [String],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isOnSale: {
        type: Boolean,
        default: false
    },
    purchaseCount: {
        type: Number,
        default: 0,
        min: 0
    },
    commentCount: {
        type: Number,
        default: 0,
        min: 0
    },
    favoriteCount: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

// Virtual field để tính discount percentage
productSchema.virtual('discountPercentage').get(function() {
    if (this.originalPrice && this.originalPrice > this.price) {
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
});

// Middleware để tự động cập nhật discount và isOnSale
productSchema.pre('save', function(next) {
    if (this.originalPrice && this.originalPrice > this.price) {
        this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
        this.isOnSale = true;
    } else {
        this.discount = 0;
        this.isOnSale = false;
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;


