const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 99
    },
    price: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    totalItems: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Middleware để tính toán totalItems và totalAmount
cartSchema.pre('save', function(next) {
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    this.totalAmount = this.items.reduce((total, item) => total + item.totalPrice, 0);
    next();
});

// Index cho performance
cartSchema.index({ user: 1 });
cartSchema.index({ 'items.product': 1 });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
