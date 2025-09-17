require('dotenv').config();
const express = require('express');
const configViewEngine = require('./src/config/viewEngine');
const apiRoutes = require('./src/routes/api');
const webRoutes = require('./src/routes/web');
const connection = require('./src/config/database');
const { initializeIndex, checkConnection } = require('./src/config/elasticsearch');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);

app.use('/', webRoutes);
app.use('/v1/api/', apiRoutes);

(async () => {
    try {
        // Kết nối MongoDB
        await connection();
        console.log('✅ Connected to MongoDB');
        
        // Data đã có trong database, không cần seed
        
        // Kiểm tra và khởi tạo Elasticsearch
        const elasticsearchConnected = await checkConnection();
        if (elasticsearchConnected) {
            await initializeIndex();
            
            // Reindex products từ MongoDB
            const { reindexAllProducts } = require('./src/services/elasticsearchService');
            await reindexAllProducts();
        } else {
            console.log('⚠️  Elasticsearch not available, using MongoDB only');
        }
        
        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`);
            console.log('📊 Data stored in MongoDB, indexed in Elasticsearch');
        });
    } catch (error) {
        console.log('>>> Error starting server: ', error);
    }
})();
