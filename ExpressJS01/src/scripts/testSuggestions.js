require('dotenv').config();
const { getSearchSuggestions } = require('../services/elasticsearchService');
const connection = require('../config/database');

const testSuggestions = async () => {
    try {
        console.log('🔄 Testing search suggestions...');
        
        // Kết nối MongoDB
        await connection();
        
        // Test với query rỗng (popular products)
        console.log('\n📋 Testing empty query (popular products):');
        const emptyResult = await getSearchSuggestions('', 5);
        console.log('Result:', JSON.stringify(emptyResult, null, 2));
        
        // Test với ký tự đơn
        console.log('\n🔍 Testing single character "i":');
        const singleCharResult = await getSearchSuggestions('i', 5);
        console.log('Result:', JSON.stringify(singleCharResult, null, 2));
        
        // Test với ký tự đơn khác
        console.log('\n🔍 Testing single character "a":');
        const singleCharResult2 = await getSearchSuggestions('a', 5);
        console.log('Result:', JSON.stringify(singleCharResult2, null, 2));
        
        // Test với từ đầy đủ
        console.log('\n🔍 Testing full word "iphone":');
        const fullWordResult = await getSearchSuggestions('iphone', 5);
        console.log('Result:', JSON.stringify(fullWordResult, null, 2));
        
        // Test với từ tiếng Việt
        console.log('\n🔍 Testing Vietnamese "điện thoại":');
        const vietnameseResult = await getSearchSuggestions('điện thoại', 5);
        console.log('Result:', JSON.stringify(vietnameseResult, null, 2));
        
        console.log('\n✅ Suggestions test completed!');
        
    } catch (error) {
        console.error('❌ Error testing suggestions:', error);
    } finally {
        process.exit(0);
    }
};

testSuggestions();

