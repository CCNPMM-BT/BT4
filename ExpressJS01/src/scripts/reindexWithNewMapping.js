require('dotenv').config();
const { reindexAllProducts } = require('../services/elasticsearchService');
const connection = require('../config/database');

const reindexWithNewMapping = async () => {
    try {
        console.log('🔄 Starting reindex with new mapping...');
        
        // Kết nối MongoDB
        await connection();
        
        // Reindex tất cả products với mapping mới
        const success = await reindexAllProducts();
        
        if (success) {
            console.log('✅ Reindex completed successfully!');
            console.log('🎉 New Elasticsearch features are now available:');
            console.log('   - Enhanced autocomplete suggestions');
            console.log('   - Similar products recommendation');
            console.log('   - Trending products');
            console.log('   - Search facets/aggregations');
            console.log('   - Typo tolerance search');
            console.log('   - Vietnamese text analysis');
        } else {
            console.log('❌ Reindex failed!');
        }
    } catch (error) {
        console.error('❌ Error during reindex:', error);
    } finally {
        process.exit(0);
    }
};

reindexWithNewMapping();

