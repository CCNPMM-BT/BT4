require('dotenv').config();
const mongoose = require('mongoose');
const { client, PRODUCTS_INDEX } = require('../config/elasticsearch');
const Product = require('../models/product');
const Category = require('../models/category');

// Đảm bảo các model được đăng ký
if (!mongoose.models.Category) {
    require('../models/category');
}
if (!mongoose.models.Product) {
    require('../models/product');
}

// Kết nối database
const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGO_DB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/expressjs01';
        await mongoose.connect(mongoUrl);
        console.log('✅ MongoDB connected successfully');
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        return false;
    }
};

// Cập nhật mapping cho index hiện tại
const updateMapping = async () => {
    try {
        console.log('🔄 Updating Elasticsearch mapping...');
        
        // Kiểm tra index có tồn tại không
        const exists = await client.indices.exists({ index: PRODUCTS_INDEX });
        if (!exists) {
            console.log('❌ Index does not exist, please run the server first to create it');
            return false;
        }

        // Cập nhật mapping cho các field mới
        await client.indices.putMapping({
            index: PRODUCTS_INDEX,
            body: {
                properties: {
                    purchaseCount: {
                        type: 'integer'
                    },
                    commentCount: {
                        type: 'integer'
                    },
                    favoriteCount: {
                        type: 'integer'
                    }
                }
            }
        });

        console.log('✅ Mapping updated successfully');
        return true;
    } catch (error) {
        console.error('❌ Error updating mapping:', error);
        return false;
    }
};

// Reindex tất cả products với dữ liệu mới
const reindexAllProducts = async () => {
    try {
        console.log('🔄 Reindexing all products...');
        
        // Lấy tất cả products từ MongoDB
        const products = await Product.find({}).populate('category');
        console.log(`📊 Found ${products.length} products to reindex`);

        // Xóa index cũ và tạo lại
        await client.indices.delete({ index: PRODUCTS_INDEX });
        console.log('🗑️ Deleted old index');

        // Tạo lại index với mapping mới
        const { initializeIndex } = require('../config/elasticsearch');
        await initializeIndex();
        console.log('✅ Created new index with updated mapping');

        // Index từng product
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            
            const document = {
                name: product.name,
                description: product.description,
                price: product.price,
                originalPrice: product.originalPrice,
                discount: product.discount,
                category: product.category?._id?.toString(),
                categoryName: product.category?.name || '',
                stock: product.stock,
                rating: product.rating || 0,
                reviewCount: product.reviewCount || 0,
                viewCount: product.viewCount || 0,
                purchaseCount: product.purchaseCount || 0,
                commentCount: product.commentCount || 0,
                favoriteCount: product.favoriteCount || 0,
                tags: product.tags || [],
                isActive: product.isActive,
                isFeatured: product.isFeatured || false,
                isOnSale: product.isOnSale || false,
                images: product.images || [],
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            };

            await client.index({
                index: PRODUCTS_INDEX,
                id: product._id.toString(),
                body: document
            });

            if ((i + 1) % 10 === 0) {
                console.log(`📝 Indexed ${i + 1}/${products.length} products`);
            }
        }

        console.log(`✅ Successfully reindexed ${products.length} products`);
        return true;
    } catch (error) {
        console.error('❌ Error reindexing products:', error);
        return false;
    }
};

// Main function
const main = async () => {
    console.log('🚀 Starting Elasticsearch mapping update...\n');
    
    const connected = await connectDB();
    if (!connected) {
        console.log('❌ Cannot connect to database, exiting...');
        process.exit(1);
    }

    const mappingUpdated = await updateMapping();
    if (!mappingUpdated) {
        console.log('❌ Mapping update failed, trying to reindex...');
    }

    const reindexed = await reindexAllProducts();
    if (!reindexed) {
        console.log('❌ Reindexing failed, exiting...');
        process.exit(1);
    }

    console.log('\n🎉 Elasticsearch mapping update completed successfully!');
    console.log('📊 All products have been reindexed with the new fields:');
    console.log('   - purchaseCount');
    console.log('   - commentCount');
    console.log('   - favoriteCount');
    
    await mongoose.disconnect();
    process.exit(0);
};

main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
});
