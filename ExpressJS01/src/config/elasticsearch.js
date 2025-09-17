const { Client } = require('@elastic/elasticsearch');

// Cấu hình Elasticsearch client
const client = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    auth: {
        username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
    },
    // Tùy chọn cho development
    requestTimeout: 30000,
    maxRetries: 3,
    resurrectStrategy: 'ping'
});

// Tên index cho products
const PRODUCTS_INDEX = 'products';

// Mapping cho products index với đầy đủ tính năng tìm kiếm
const productsMapping = {
    mappings: {
        properties: {
            name: {
                type: 'text',
                analyzer: 'vietnamese_analyzer',
                fields: {
                    keyword: {
                        type: 'keyword'
                    },
                    suggest: {
                        type: 'completion',
                        analyzer: 'simple',
                        search_analyzer: 'simple',
                        preserve_separators: true,
                        preserve_position_increments: true,
                        max_input_length: 50
                    },
                    autocomplete: {
                        type: 'text',
                        analyzer: 'autocomplete_analyzer',
                        search_analyzer: 'autocomplete_search_analyzer'
                    }
                }
            },
            description: {
                type: 'text',
                analyzer: 'vietnamese_analyzer',
                fields: {
                    keyword: {
                        type: 'keyword'
                    }
                }
            },
            price: {
                type: 'float'
            },
            originalPrice: {
                type: 'float'
            },
            discount: {
                type: 'float'
            },
            category: {
                type: 'keyword'
            },
            categoryName: {
                type: 'text',
                analyzer: 'vietnamese_analyzer',
                fields: {
                    keyword: {
                        type: 'keyword'
                    },
                    suggest: {
                        type: 'completion',
                        analyzer: 'simple',
                        search_analyzer: 'simple'
                    }
                }
            },
            stock: {
                type: 'integer'
            },
            rating: {
                type: 'float'
            },
            reviewCount: {
                type: 'integer'
            },
            viewCount: {
                type: 'integer'
            },
            purchaseCount: {
                type: 'integer'
            },
            commentCount: {
                type: 'integer'
            },
            favoriteCount: {
                type: 'integer'
            },
            tags: {
                type: 'keyword',
                fields: {
                    suggest: {
                        type: 'completion',
                        analyzer: 'simple',
                        search_analyzer: 'simple'
                    }
                }
            },
            isActive: {
                type: 'boolean'
            },
            isFeatured: {
                type: 'boolean'
            },
            isOnSale: {
                type: 'boolean'
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
        number_of_shards: 1,
        number_of_replicas: 0,
        analysis: {
            analyzer: {
                vietnamese_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase', 'asciifolding', 'vietnamese_stop']
                },
                autocomplete_analyzer: {
                    type: 'custom',
                    tokenizer: 'autocomplete_tokenizer',
                    filter: ['lowercase', 'asciifolding']
                },
                autocomplete_search_analyzer: {
                    type: 'custom',
                    tokenizer: 'keyword',
                    filter: ['lowercase', 'asciifolding']
                }
            },
            tokenizer: {
                autocomplete_tokenizer: {
                    type: 'edge_ngram',
                    min_gram: 1,
                    max_gram: 20,
                    token_chars: ['letter', 'digit']
                }
            },
            filter: {
                vietnamese_stop: {
                    type: 'stop',
                    stopwords: ['và', 'của', 'cho', 'với', 'từ', 'trong', 'có', 'được', 'là', 'một', 'các', 'như', 'để', 'này', 'đó', 'khi', 'nếu', 'vì', 'sau', 'trước', 'trên', 'dưới', 'giữa', 'ngoài', 'trong', 'ngoài', 'về', 'theo', 'qua', 'bằng', 'bởi', 'do', 'tại', 'ở', 'vào', 'ra', 'lên', 'xuống', 'qua', 'lại', 'về', 'đến', 'từ', 'của', 'cho', 'với', 'và', 'hoặc', 'nhưng', 'mà', 'nên', 'để', 'để', 'mà', 'nếu', 'khi', 'vì', 'sau', 'trước', 'trên', 'dưới', 'giữa', 'ngoài', 'trong', 'ngoài', 'về', 'theo', 'qua', 'bằng', 'bởi', 'do', 'tại', 'ở', 'vào', 'ra', 'lên', 'xuống', 'qua', 'lại', 'về', 'đến', 'từ']
                }
            }
        }
    }
};

// Khởi tạo index nếu chưa tồn tại
const initializeIndex = async () => {
    try {
        const exists = await client.indices.exists({ index: PRODUCTS_INDEX });
        
        if (!exists) {
            await client.indices.create({
                index: PRODUCTS_INDEX,
                body: productsMapping
            });
            console.log(`✅ Created Elasticsearch index: ${PRODUCTS_INDEX}`);
        } else {
            console.log(`✅ Elasticsearch index already exists: ${PRODUCTS_INDEX}`);
        }
    } catch (error) {
        console.error('❌ Error initializing Elasticsearch index:', error);
        throw error;
    }
};

// Kiểm tra kết nối Elasticsearch
const checkConnection = async () => {
    try {
        const response = await client.ping();
        console.log('✅ Elasticsearch connection successful');
        return true;
    } catch (error) {
        console.error('❌ Elasticsearch connection failed:', error);
        return false;
    }
};

module.exports = {
    client,
    PRODUCTS_INDEX,
    initializeIndex,
    checkConnection
};

