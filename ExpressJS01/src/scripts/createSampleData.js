const mongoose = require('mongoose');
const Product = require('../models/product');
const Comment = require('../models/comment');
const Purchase = require('../models/purchase');
const User = require('../models/user');
const Category = require('../models/category');
const bcrypt = require('bcrypt');

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

// Tạo dữ liệu mẫu
const createSampleData = async () => {
    try {
        console.log('Bắt đầu tạo dữ liệu mẫu...');

        // 1. Tạo category mẫu
        let category = await Category.findOne({ name: 'Điện thoại' });
        if (!category) {
            category = await Category.create({
                name: 'Điện thoại',
                description: 'Điện thoại di động và phụ kiện'
            });
            console.log('✅ Tạo category: Điện thoại');
        }

        // 2. Tạo user mẫu
        let testUser = await User.findOne({ email: 'test@example.com' });
        if (!testUser) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            testUser = await User.create({
                name: 'Người dùng Test',
                email: 'test@example.com',
                password: hashedPassword,
                role: 'User',
                favoriteProducts: [],
                viewedProducts: []
            });
            console.log('✅ Tạo user: test@example.com');
        }

        // 3. Tạo sản phẩm mẫu
        let product = await Product.findOne({ name: 'iPhone 15 Pro Max' });
        if (!product) {
            product = await Product.create({
                name: 'iPhone 15 Pro Max',
                description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP và màn hình Super Retina XDR 6.7 inch',
                price: 29990000,
                originalPrice: 32990000,
                images: [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
                ],
                category: category._id,
                stock: 50,
                isActive: true,
                tags: ['iPhone', 'Apple', 'Smartphone', 'Premium'],
                rating: 0,
                reviewCount: 0,
                viewCount: 0,
                purchaseCount: 0,
                commentCount: 0,
                favoriteCount: 0,
                isFeatured: true,
                isOnSale: true
            });
            console.log('✅ Tạo sản phẩm: iPhone 15 Pro Max');
        }

        // 4. Tạo comments mẫu
        const sampleComments = [
            {
                content: 'Sản phẩm rất tốt, camera chụp ảnh rất đẹp. Pin trâu, dùng cả ngày không hết pin. Rất hài lòng với sản phẩm này!',
                rating: 5
            },
            {
                content: 'iPhone 15 Pro Max có thiết kế đẹp, màn hình sắc nét. Tuy nhiên giá hơi cao so với túi tiền. Nhìn chung là sản phẩm chất lượng.',
                rating: 4
            },
            {
                content: 'Mua về dùng được 1 tuần, máy chạy mượt mà, không bị lag. Camera chụp ảnh ban đêm rất tốt. Đáng tiền bạc.',
                rating: 5
            },
            {
                content: 'Thiết kế đẹp nhưng pin hơi nhanh hết. Cần sạc 2 lần/ngày nếu dùng nhiều. Camera thì không có gì phàn nàn.',
                rating: 3
            },
            {
                content: 'Sản phẩm cao cấp, đáng giá tiền. Màn hình 6.7 inch rất rộng, phù hợp để xem phim và chơi game. Khuyến nghị mua!',
                rating: 5
            }
        ];

        for (let i = 0; i < sampleComments.length; i++) {
            const commentData = sampleComments[i];
            const existingComment = await Comment.findOne({
                product: product._id,
                user: testUser._id,
                content: commentData.content
            });

            if (!existingComment) {
                await Comment.create({
                    product: product._id,
                    user: testUser._id,
                    content: commentData.content,
                    rating: commentData.rating,
                    isApproved: true,
                    likes: [],
                    likeCount: 0
                });
                console.log(`✅ Tạo comment ${i + 1}: ${commentData.content.substring(0, 30)}...`);
            }
        }

        // 5. Tạo purchases mẫu
        const samplePurchases = [
            { quantity: 1, status: 'completed' },
            { quantity: 2, status: 'completed' },
            { quantity: 1, status: 'completed' },
            { quantity: 1, status: 'pending' }
        ];

        for (let i = 0; i < samplePurchases.length; i++) {
            const purchaseData = samplePurchases[i];
            const existingPurchase = await Purchase.findOne({
                product: product._id,
                user: testUser._id,
                quantity: purchaseData.quantity
            });

            if (!existingPurchase) {
                await Purchase.create({
                    user: testUser._id,
                    product: product._id,
                    quantity: purchaseData.quantity,
                    price: product.price,
                    totalAmount: product.price * purchaseData.quantity,
                    status: purchaseData.status,
                    paymentMethod: 'bank_transfer',
                    shippingAddress: {
                        fullName: 'Người dùng Test',
                        phone: '0123456789',
                        address: '123 Đường ABC, Quận 1',
                        city: 'TP.HCM',
                        district: 'Quận 1',
                        ward: 'Phường Bến Nghé'
                    },
                    notes: 'Giao hàng nhanh'
                });
                console.log(`✅ Tạo purchase ${i + 1}: ${purchaseData.quantity} sản phẩm - ${purchaseData.status}`);
            }
        }

        // 6. Thêm sản phẩm vào favorite của user
        if (!testUser.favoriteProducts.includes(product._id)) {
            testUser.favoriteProducts.push(product._id);
            await testUser.save();
            console.log('✅ Thêm sản phẩm vào favorite');
        }

        // 7. Thêm sản phẩm vào viewed products
        const existingView = testUser.viewedProducts.find(
            view => view.product.toString() === product._id.toString()
        );
        if (!existingView) {
            testUser.viewedProducts.push({
                product: product._id,
                viewedAt: new Date()
            });
            await testUser.save();
            console.log('✅ Thêm sản phẩm vào viewed products');
        }

        // 8. Cập nhật thống kê sản phẩm
        const commentCount = await Comment.countDocuments({ 
            product: product._id, 
            isApproved: true 
        });
        
        const comments = await Comment.find({ 
            product: product._id, 
            isApproved: true 
        });
        
        let averageRating = 0;
        if (comments.length > 0) {
            const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
            averageRating = totalRating / comments.length;
        }

        const purchaseStats = await Purchase.aggregate([
            { $match: { product: product._id, status: 'completed' } },
            { $group: { _id: null, totalQuantity: { $sum: '$quantity' } } }
        ]);
        const purchaseCount = purchaseStats[0]?.totalQuantity || 0;

        const favoriteCount = await User.countDocuments({
            favoriteProducts: product._id
        });

        await Product.findByIdAndUpdate(product._id, {
            commentCount,
            reviewCount: commentCount,
            rating: averageRating,
            purchaseCount,
            favoriteCount,
            viewCount: 150 // Giả lập lượt xem
        });

        console.log('\n🎉 Hoàn thành tạo dữ liệu mẫu!');
        console.log(`📊 Thống kê sản phẩm ${product.name}:`);
        console.log(`   - Bình luận: ${commentCount}`);
        console.log(`   - Rating: ${averageRating.toFixed(2)}`);
        console.log(`   - Đã mua: ${purchaseCount}`);
        console.log(`   - Yêu thích: ${favoriteCount}`);
        console.log(`   - Lượt xem: 150`);

    } catch (error) {
        console.error('Lỗi khi tạo dữ liệu mẫu:', error);
    }
};

// Chạy script
const runScript = async () => {
    await connectDB();
    await createSampleData();
    await mongoose.disconnect();
    console.log('Script hoàn thành');
    process.exit(0);
};

runScript().catch(error => {
    console.error('Script error:', error);
    process.exit(1);
});
