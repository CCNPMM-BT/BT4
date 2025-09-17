const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'bank_transfer', 'e_wallet'],
        required: true
    },
    shippingAddress: {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        district: String,
        ward: String
    },
    notes: String
}, {
    timestamps: true
});

// Index for better query performance
purchaseSchema.index({ user: 1, createdAt: -1 });
purchaseSchema.index({ product: 1, createdAt: -1 });
purchaseSchema.index({ status: 1, createdAt: -1 });

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
