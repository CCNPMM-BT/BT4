const { client, PRODUCTS_INDEX } = require('../config/elasticsearch');
const Product = require('../models/product');
const Comment = require('../models/comment');
const Purchase = require('../models/purchase');

// Cập nhật thống kê sản phẩm
const updateProductStats = async () => {
    try {
        console.log('Bắt đầu cập nhật thống kê sản phẩm...');

        // Lấy tất cả sản phẩm
        const products = await Product.find({});
        console.log(`Tìm thấy ${products.length} sản phẩm`);

        for (const product of products) {
            // Đếm số bình luận
            const commentCount = await Comment.countDocuments({ 
                product: product._id, 
                isApproved: true 
            });

            // Đếm số đơn hàng đã hoàn thành
            const purchaseCount = await Purchase.aggregate([
                { $match: { product: product._id, status: 'completed' } },
                { $group: { _id: null, totalQuantity: { $sum: '$quantity' } } }
            ]);

            const totalPurchases = purchaseCount[0]?.totalQuantity || 0;

            // Cập nhật sản phẩm trong MongoDB
            await Product.findByIdAndUpdate(product._id, {
                commentCount,
                purchaseCount: totalPurchases
            });

            // Cập nhật trong Elasticsearch
            await client.update({
                index: PRODUCTS_INDEX,
                id: product._id.toString(),
                body: {
                    doc: {
                        commentCount,
                        purchaseCount: totalPurchases
                    }
                }
            });

            console.log(`Đã cập nhật sản phẩm: ${product.name} - Comments: ${commentCount}, Purchases: ${totalPurchases}`);
        }

        console.log('Hoàn thành cập nhật thống kê sản phẩm!');
    } catch (error) {
        console.error('Lỗi khi cập nhật thống kê sản phẩm:', error);
    }
};

// Chạy script
updateProductStats().then(() => {
    console.log('Script hoàn thành');
    process.exit(0);
}).catch(error => {
    console.error('Lỗi script:', error);
    process.exit(1);
});
