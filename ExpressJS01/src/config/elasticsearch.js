const { Client } = require('elasticsearch');

const client = new Client({
    host: process.env.ELASTICSEARCH_URL || 'localhost:9200',
    log: 'error'
});

// Test connection
const testConnection = async () => {
    try {
        const response = await client.ping();
        console.log('Elasticsearch connected successfully');
        return true;
    } catch (error) {
        console.error('Elasticsearch connection failed:', error.message);
        return false;
    }
};

// Create product index with mapping
const createProductIndex = async () => {
    const indexName = 'products';
    
    try {
        // Check if index exists
        const exists = await client.indices.exists({ index: indexName });
        
        if (!exists) {
            await client.indices.create({
                index: indexName,
                body: {
                    mappings: {
                        properties: {
                            name: {
                                type: 'text',
                                analyzer: 'standard',
                                fields: {
                                    keyword: {
                                        type: 'keyword'
                                    },
                                    suggest: {
                                        type: 'completion'
                                    }
                                }
                            },
                            description: {
                                type: 'text',
                                analyzer: 'standard'
                            },
                            price: {
                                type: 'float'
                            },
                            originalPrice: {
                                type: 'float'
                            },
                            category: {
                                type: 'keyword'
                            },
                            categoryName: {
                                type: 'text',
                                analyzer: 'standard'
                            },
                            stock: {
                                type: 'integer'
                            },
                            isActive: {
                                type: 'boolean'
                            },
                            tags: {
                                type: 'keyword'
                            },
                            rating: {
                                type: 'float'
                            },
                            reviewCount: {
                                type: 'integer'
                            },
                            discount: {
                                type: 'float'
                            },
                            views: {
                                type: 'integer',
                                default: 0
                            },
                            createdAt: {
                                type: 'date'
                            },
                            updatedAt: {
                                type: 'date'
                            }
                        }
                    },
                    settings: {
                        analysis: {
                            analyzer: {
                                vietnamese_analyzer: {
                                    type: 'custom',
                                    tokenizer: 'standard',
                                    filter: ['lowercase', 'asciifolding']
                                }
                            }
                        }
                    }
                }
            });
            console.log(`Index '${indexName}' created successfully`);
        } else {
            console.log(`Index '${indexName}' already exists`);
        }
    } catch (error) {
        console.error('Error creating index:', error);
    }
};

// Index a product document
const indexProduct = async (product) => {
    try {
        const doc = {
            ...product,
            category: product.category._id || product.category,
            categoryName: product.category.name || '',
            discount: product.originalPrice ? 
                ((product.originalPrice - product.price) / product.originalPrice * 100) : 0
        };
        
        await client.index({
            index: 'products',
            id: product._id.toString(),
            body: doc
        });
        
        console.log(`Product ${product._id} indexed successfully`);
    } catch (error) {
        console.error('Error indexing product:', error);
    }
};

// Bulk index products
const bulkIndexProducts = async (products) => {
    try {
        const body = [];
        
        products.forEach(product => {
            const doc = {
                ...product,
                category: product.category._id || product.category,
                categoryName: product.category.name || '',
                discount: product.originalPrice ? 
                    ((product.originalPrice - product.price) / product.originalPrice * 100) : 0
            };
            
            body.push({
                index: {
                    _index: 'products',
                    _id: product._id.toString()
                }
            });
            body.push(doc);
        });
        
        if (body.length > 0) {
            await client.bulk({ body });
            console.log(`${products.length} products indexed successfully`);
        }
    } catch (error) {
        console.error('Error bulk indexing products:', error);
    }
};

// Delete product from index
const deleteProduct = async (productId) => {
    try {
        await client.delete({
            index: 'products',
            id: productId.toString()
        });
        console.log(`Product ${productId} deleted from index`);
    } catch (error) {
        console.error('Error deleting product from index:', error);
    }
};

// Update product in index
const updateProduct = async (productId, product) => {
    try {
        const doc = {
            ...product,
            category: product.category._id || product.category,
            categoryName: product.category.name || '',
            discount: product.originalPrice ? 
                ((product.originalPrice - product.price) / product.originalPrice * 100) : 0
        };
        
        await client.index({
            index: 'products',
            id: productId.toString(),
            body: doc
        });
        
        console.log(`Product ${productId} updated in index`);
    } catch (error) {
        console.error('Error updating product in index:', error);
    }
};

module.exports = {
    client,
    testConnection,
    createProductIndex,
    indexProduct,
    bulkIndexProducts,
    deleteProduct,
    updateProduct
};
