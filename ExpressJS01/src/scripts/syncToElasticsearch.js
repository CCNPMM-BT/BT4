const mongoose = require('mongoose');
const Product = require('../models/product');
const Category = require('../models/category');
const { bulkIndexProducts, testConnection } = require('../config/elasticsearch');
require('dotenv').config();

const syncProductsToElasticsearch = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expressjs01');
        console.log('Connected to MongoDB');

        // Test Elasticsearch connection
        const esConnected = await testConnection();
        if (!esConnected) {
            console.error('Elasticsearch connection failed');
            process.exit(1);
        }

        // Get all products with category information
        const products = await Product.find({ isActive: true })
            .populate('category', 'name')
            .lean();

        console.log(`Found ${products.length} products to sync`);

        if (products.length > 0) {
            // Add views field if not exists
            const productsWithViews = products.map(product => ({
                ...product,
                views: product.views || 0
            }));

            await bulkIndexProducts(productsWithViews);
            console.log('Products synced to Elasticsearch successfully');
        } else {
            console.log('No products found to sync');
        }

    } catch (error) {
        console.error('Sync error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
};

// Run sync if this file is executed directly
if (require.main === module) {
    syncProductsToElasticsearch();
}

module.exports = syncProductsToElasticsearch;
