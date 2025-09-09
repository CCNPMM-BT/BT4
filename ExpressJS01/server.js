require('dotenv').config();
const express = require('express');
const configViewEngine = require('./src/config/viewEngine');
const apiRoutes = require('./src/routes/api');
const webRoutes = require('./src/routes/web');
const connection = require('./src/config/database');
const { testConnection, createProductIndex } = require('./src/config/elasticsearch');
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
        await connection();
        
        // Initialize Elasticsearch
        const esConnected = await testConnection();
        if (esConnected) {
            await createProductIndex();
        }
        
        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`);
        });
    } catch (error) {
        console.log('>>> Error connect to DB: ', error);
    }
})();