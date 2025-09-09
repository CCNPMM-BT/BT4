const { client } = require('../config/elasticsearch');

class ElasticsearchService {
    // Fuzzy search with multiple filters
    async searchProducts(query, filters = {}, pagination = {}) {
        const {
            category,
            minPrice,
            maxPrice,
            minDiscount,
            maxDiscount,
            minRating,
            minViews,
            tags,
            sortBy = 'relevance',
            sortOrder = 'desc'
        } = filters;

        const { page = 1, limit = 12 } = pagination;
        const from = (page - 1) * limit;

        try {
            const searchBody = {
                query: {
                    bool: {
                        must: [],
                        filter: []
                    }
                },
                sort: [],
                from,
                size: limit,
                highlight: {
                    fields: {
                        name: {},
                        description: {}
                    }
                }
            };

            // Main search query (fuzzy search)
            if (query && query.trim()) {
                searchBody.query.bool.must.push({
                    multi_match: {
                        query: query,
                        fields: ['name^3', 'description^2', 'categoryName^2', 'tags^1.5'],
                        type: 'best_fields',
                        fuzziness: 'AUTO',
                        prefix_length: 1,
                        max_expansions: 50
                    }
                });
            } else {
                // If no search query, match all
                searchBody.query.bool.must.push({ match_all: {} });
            }

            // Category filter
            if (category) {
                searchBody.query.bool.filter.push({
                    term: { category: category }
                });
            }

            // Price range filter
            if (minPrice !== undefined || maxPrice !== undefined) {
                const priceRange = {};
                if (minPrice !== undefined) priceRange.gte = minPrice;
                if (maxPrice !== undefined) priceRange.lte = maxPrice;
                
                searchBody.query.bool.filter.push({
                    range: { price: priceRange }
                });
            }

            // Discount range filter
            if (minDiscount !== undefined || maxDiscount !== undefined) {
                const discountRange = {};
                if (minDiscount !== undefined) discountRange.gte = minDiscount;
                if (maxDiscount !== undefined) discountRange.lte = maxDiscount;
                
                searchBody.query.bool.filter.push({
                    range: { discount: discountRange }
                });
            }

            // Rating filter
            if (minRating !== undefined) {
                searchBody.query.bool.filter.push({
                    range: { rating: { gte: minRating } }
                });
            }

            // Views filter
            if (minViews !== undefined) {
                searchBody.query.bool.filter.push({
                    range: { views: { gte: minViews } }
                });
            }

            // Tags filter
            if (tags && tags.length > 0) {
                searchBody.query.bool.filter.push({
                    terms: { tags: tags }
                });
            }

            // Active products only
            searchBody.query.bool.filter.push({
                term: { isActive: true }
            });

            // Sorting
            switch (sortBy) {
                case 'price_asc':
                    searchBody.sort.push({ price: { order: 'asc' } });
                    break;
                case 'price_desc':
                    searchBody.sort.push({ price: { order: 'desc' } });
                    break;
                case 'rating':
                    searchBody.sort.push({ rating: { order: sortOrder } });
                    break;
                case 'views':
                    searchBody.sort.push({ views: { order: sortOrder } });
                    break;
                case 'discount':
                    searchBody.sort.push({ discount: { order: sortOrder } });
                    break;
                case 'newest':
                    searchBody.sort.push({ createdAt: { order: 'desc' } });
                    break;
                case 'oldest':
                    searchBody.sort.push({ createdAt: { order: 'asc' } });
                    break;
                default: // relevance
                    if (query && query.trim()) {
                        searchBody.sort.push({ _score: { order: 'desc' } });
                    } else {
                        searchBody.sort.push({ createdAt: { order: 'desc' } });
                    }
                    break;
            }

            const response = await client.search({
                index: 'products',
                body: searchBody
            });

            return {
                products: response.hits.hits.map(hit => ({
                    ...hit._source,
                    _id: hit._id,
                    _score: hit._score,
                    highlight: hit.highlight
                })),
                total: response.hits.total.value,
                page,
                limit,
                totalPages: Math.ceil(response.hits.total.value / limit)
            };

        } catch (error) {
            console.error('Elasticsearch search error:', error);
            throw new Error('Search failed');
        }
    }

    // Auto-complete suggestions
    async getSuggestions(query, limit = 10) {
        try {
            const response = await client.search({
                index: 'products',
                body: {
                    suggest: {
                        product_suggest: {
                            prefix: query,
                            completion: {
                                field: 'name.suggest',
                                size: limit
                            }
                        }
                    }
                }
            });

            return response.suggest.product_suggest[0].options.map(option => ({
                text: option.text,
                score: option._score
            }));

        } catch (error) {
            console.error('Elasticsearch suggestions error:', error);
            return [];
        }
    }

    // Get popular search terms
    async getPopularSearches(limit = 10) {
        try {
            const response = await client.search({
                index: 'products',
                body: {
                    aggs: {
                        popular_tags: {
                            terms: {
                                field: 'tags',
                                size: limit
                            }
                        }
                    },
                    size: 0
                }
            });

            return response.aggregations.popular_tags.buckets.map(bucket => ({
                term: bucket.key,
                count: bucket.doc_count
            }));

        } catch (error) {
            console.error('Elasticsearch popular searches error:', error);
            return [];
        }
    }

    // Get category statistics
    async getCategoryStats() {
        try {
            const response = await client.search({
                index: 'products',
                body: {
                    aggs: {
                        categories: {
                            terms: {
                                field: 'category',
                                size: 100
                            },
                            aggs: {
                                avg_price: {
                                    avg: { field: 'price' }
                                },
                                min_price: {
                                    min: { field: 'price' }
                                },
                                max_price: {
                                    max: { field: 'price' }
                                },
                                total_products: {
                                    value_count: { field: 'category' }
                                }
                            }
                        }
                    },
                    size: 0
                }
            });

            return response.aggregations.categories.buckets.map(bucket => ({
                categoryId: bucket.key,
                count: bucket.doc_count,
                avgPrice: bucket.avg_price.value,
                minPrice: bucket.min_price.value,
                maxPrice: bucket.max_price.value
            }));

        } catch (error) {
            console.error('Elasticsearch category stats error:', error);
            return [];
        }
    }

    // Get price range for filters
    async getPriceRange() {
        try {
            const response = await client.search({
                index: 'products',
                body: {
                    aggs: {
                        price_stats: {
                            stats: { field: 'price' }
                        }
                    },
                    size: 0
                }
            });

            const stats = response.aggregations.price_stats;
            return {
                min: Math.floor(stats.min),
                max: Math.ceil(stats.max),
                avg: Math.round(stats.avg)
            };

        } catch (error) {
            console.error('Elasticsearch price range error:', error);
            return { min: 0, max: 1000000, avg: 100000 };
        }
    }
}

module.exports = new ElasticsearchService();
