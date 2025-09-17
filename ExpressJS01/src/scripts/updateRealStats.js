const mongoose = require('mongoose');
const Product = require('../models/product');
const Comment = require('../models/comment');
const Purchase = require('../models/purchase');
const User = require('../models/user');

// Kết nối database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expressjs01');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Cập nhật thống kê thực tế cho tất cả sản phẩm
const updateRealStats = async () => {
    try {
        console.log('Bắt đầu cập nhật thống kê thực tế...');

        // Lấy tất cả sản phẩm
        const products = await Product.find({});
        console.log(`Tìm thấy ${products.length} sản phẩm`);

        for (const product of products) {
            console.log(`\nCập nhật sản phẩm: ${product.name}`);

            // 1. Đếm số bình luận thực tế
            const commentCount = await Comment.countDocuments({ 
                product: product._id, 
                isApproved: true 
            });
            console.log(`  - Bình luận: ${commentCount}`);

            // 2. Tính rating trung bình thực tế
            const comments = await Comment.find({ 
                product: product._id, 
                isApproved: true 
            });
            
            let averageRating = 0;
            if (comments.length > 0) {
                const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
                averageRating = totalRating / comments.length;
            }
            console.log(`  - Rating trung bình: ${averageRating.toFixed(2)}`);

            // 3. Đếm số lượt mua thực tế
            const purchaseStats = await Purchase.aggregate([
                { $match: { product: product._id, status: 'completed' } },
                { $group: { _id: null, totalQuantity: { $sum: '$quantity' } } }
            ]);
            const purchaseCount = purchaseStats[0]?.totalQuantity || 0;
            console.log(`  - Đã mua: ${purchaseCount}`);

            // 4. Đếm số lượt yêu thích thực tế
            const favoriteCount = await User.countDocuments({
                favoriteProducts: product._id
            });
            console.log(`  - Yêu thích: ${favoriteCount}`);

            // 5. Cập nhật sản phẩm
            await Product.findByIdAndUpdate(product._id, {
                commentCount,
                reviewCount: commentCount,
                rating: averageRating,
                purchaseCount,
                favoriteCount
            });

            console.log(`  ✅ Đã cập nhật sản phẩm: ${product.name}`);
        }

        console.log('\n🎉 Hoàn thành cập nhật thống kê thực tế!');
    } catch (error) {
        console.error('Lỗi khi cập nhật thống kê:', error);
    }
};

// Chạy script
const runScript = async () => {
    await connectDB();
    await updateRealStats();
    await mongoose.disconnect();
    console.log('Script hoàn thành');
    process.exit(0);
};

runScript().catch(error => {
    console.error('Script error:', error);
    process.exit(1);
});
