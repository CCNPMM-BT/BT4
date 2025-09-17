require('dotenv').config();
const mongoose = require('mongoose');

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

// Test models
const testModels = async () => {
    try {
        console.log('\n🔍 Testing models...');
        
        // Test Comment model
        const Comment = require('./src/models/comment');
        console.log('✅ Comment model loaded');
        
        // Test Product model
        const Product = require('./src/models/product');
        console.log('✅ Product model loaded');
        
        // Test User model
        const User = require('./src/models/user');
        console.log('✅ User model loaded');
        
        // Test Comment creation
        console.log('\n🧪 Testing Comment creation...');
        const testComment = new Comment({
            product: new mongoose.Types.ObjectId(),
            user: new mongoose.Types.ObjectId(),
            content: 'Test comment',
            rating: 5
        });
        
        console.log('✅ Comment model can be instantiated');
        console.log('Comment schema:', testComment.schema.paths);
        
        return true;
    } catch (error) {
        console.error('❌ Model test error:', error);
        return false;
    }
};

// Test database operations
const testDatabaseOperations = async () => {
    try {
        console.log('\n🗄️ Testing database operations...');
        
        const Comment = require('./src/models/comment');
        const Product = require('./src/models/product');
        const User = require('./src/models/user');
        
        // Count documents
        const commentCount = await Comment.countDocuments();
        const productCount = await Product.countDocuments();
        const userCount = await User.countDocuments();
        
        console.log(`📊 Database stats:`);
        console.log(`   - Comments: ${commentCount}`);
        console.log(`   - Products: ${productCount}`);
        console.log(`   - Users: ${userCount}`);
        
        return true;
    } catch (error) {
        console.error('❌ Database operations error:', error);
        return false;
    }
};

// Main test function
const runTest = async () => {
    console.log('🚀 Starting database connection test...\n');
    
    const connected = await connectDB();
    if (!connected) {
        console.log('❌ Cannot connect to database, exiting...');
        process.exit(1);
    }
    
    const modelsOk = await testModels();
    if (!modelsOk) {
        console.log('❌ Model test failed, exiting...');
        process.exit(1);
    }
    
    const dbOpsOk = await testDatabaseOperations();
    if (!dbOpsOk) {
        console.log('❌ Database operations test failed, exiting...');
        process.exit(1);
    }
    
    console.log('\n🎉 All tests passed! Database and models are working correctly.');
    await mongoose.disconnect();
    process.exit(0);
};

runTest().catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
