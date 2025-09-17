require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product');
const Category = require('../models/category');

const connection = require('../config/database');

// Extensive real images from Unsplash
const productImages = [
    // Electronics - Phones (5 images)
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1511707171631-5e697c2af064?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1511707171631-5e697c2af064?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1511707171631-5e697c2af064?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1511707171631-5e697c2af064?w=400&h=400&fit=crop&crop=center',
    
    // Electronics - Laptops (5 images)
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center',
    
    // Electronics - Tablets (3 images)
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop&crop=center',
    
    // Electronics - Accessories (6 images)
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&crop=center',
    
    // Fashion - Clothing (5 images)
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
    
    // Fashion - Shoes & Accessories (8 images)
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1511499767150-a48a237f0c5c?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1511499767150-a48a237f0c5c?w=400&h=400&fit=crop&crop=center',
    
    // Home & Garden (8 images)
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center',
    
    // Sports (8 images)
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
    
    // Books & Stationery (5 images)
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center',
    
    // Beauty & Health (4 images)
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=400&fit=crop&crop=center',
    
    // Toys & Games (4 images)
    'https://images.unsplash.com/photo-1558060370-539c7d5a3a7e?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1558060370-539c7d5a3a7e?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=400&fit=crop&crop=center',
    
    // Automotive (4 images)
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=400&fit=crop&crop=center',
    
    // Default
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center'
];

const categoryImages = [
    // Electronics
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1511707171631-5e697c2af064?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop&crop=center',
    
    // Fashion
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop&crop=center',
    
    // Home & Garden
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&crop=center',
    
    // Sports
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop&crop=center',
    
    // Books & Stationery
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&crop=center',
    
    // Beauty & Health
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=400&fit=crop&crop=center',
    
    // Toys & Games
    'https://images.unsplash.com/photo-1558060370-539c7d5a3a7e?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=600&h=400&fit=crop&crop=center',
    
    // Automotive
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1549317336-206569e8475c?w=600&h=400&fit=crop&crop=center',
    
    // Default
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&crop=center'
];

const updateImages = async () => {
    try {
        console.log('🔄 Starting image update...');
        
        // Update products
        const products = await Product.find({});
        console.log(`📦 Found ${products.length} products to update`);
        
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const randomImage = productImages[Math.floor(Math.random() * productImages.length)];
            
            await Product.findByIdAndUpdate(product._id, {
                images: [randomImage]
            });
            
            console.log(`✅ Updated product: ${product.name}`);
        }
        
        // Update categories
        const categories = await Category.find({});
        console.log(`📂 Found ${categories.length} categories to update`);
        
        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];
            const randomImage = categoryImages[Math.floor(Math.random() * categoryImages.length)];
            
            await Category.findByIdAndUpdate(category._id, {
                image: randomImage
            });
            
            console.log(`✅ Updated category: ${category.name}`);
        }
        
        console.log('🎉 Image update completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating images:', error);
        process.exit(1);
    }
};

// Run the update
updateImages();
