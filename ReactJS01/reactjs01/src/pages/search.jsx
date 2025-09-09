import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Row,
    Col,
    Typography,
    Spin,
    Alert,
    Space,
    Button,
    Breadcrumb,
    Card,
    Tag,
    Divider
} from 'antd';
import {
    HomeOutlined,
    SearchOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import {
    searchProductsApi,
    getPopularSearchesApi
} from '../util/apis';
import ProductCard from '../components/common/ProductCard';
import AdvancedSearch from '../components/common/AdvancedSearch';

const { Title, Text } = Typography;

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [popularSearches, setPopularSearches] = useState([]);

    const query = searchParams.get('q') || '';

    useEffect(() => {
        if (query) {
            performSearch({ q: query });
        }
        fetchPopularSearches();
    }, [query]);

    const fetchPopularSearches = async () => {
        try {
            const response = await getPopularSearchesApi(10);
            if (response && response.data.success) {
                setPopularSearches(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching popular searches:', error);
        }
    };

    const performSearch = async (params) => {
        setLoading(true);
        setError(null);

        try {
            const response = await searchProductsApi(params);
            if (response && response.data.success) {
                setSearchResults(response.data.data);
                setProducts(response.data.data.products);
            } else {
                setError('Không thể thực hiện tìm kiếm');
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('Có lỗi xảy ra khi tìm kiếm');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchResults = (results) => {
        setSearchResults(results);
        setProducts(results.products);
        
        // Update URL with search query
        const newSearchParams = new URLSearchParams();
        if (results.products.length > 0) {
            // Extract query from first product's highlight or use a default
            newSearchParams.set('q', results.products[0].name || '');
        }
        setSearchParams(newSearchParams);
    };

    const handleSearchLoading = (isLoading) => {
        setLoading(isLoading);
    };

    const handleViewDetail = (product) => {
        navigate(`/product/${product._id}`);
    };

    const handleAddToCart = (product) => {
        // TODO: Implement add to cart functionality
        console.log('Add to cart:', product);
    };

    const handlePopularSearch = (term) => {
        navigate(`/search?q=${encodeURIComponent(term)}`);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '20px' }}>Đang tìm kiếm...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        {
                            title: (
                                <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                                    <HomeOutlined /> Trang chủ
                                </span>
                            )
                        },
                        {
                            title: 'Tìm kiếm'
                        }
                    ]}
                />

                {/* Header */}
                <div>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={2} style={{ margin: 0 }}>
                                Tìm kiếm sản phẩm
                            </Title>
                            {searchResults && (
                                <Text type="secondary">
                                    Tìm thấy {searchResults.total} sản phẩm
                                    {query && ` cho "${query}"`}
                                </Text>
                            )}
                        </Col>
                        <Col>
                            <Button 
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate('/products')}
                            >
                                Quay lại
                            </Button>
                        </Col>
                    </Row>
                </div>

                {/* Advanced Search */}
                <AdvancedSearch
                    onSearchResults={handleSearchResults}
                    onLoading={handleSearchLoading}
                />

                {/* Error Display */}
                {error && (
                    <Alert
                        message="Lỗi tìm kiếm"
                        description={error}
                        type="error"
                        showIcon
                        action={
                            <Button size="small" onClick={() => performSearch({ q: query })}>
                                Thử lại
                            </Button>
                        }
                    />
                )}

                {/* Search Results */}
                {products.length > 0 && (
                    <div>
                        <Title level={3}>Kết quả tìm kiếm</Title>
                        <Row gutter={[24, 24]}>
                            {products.map((product) => (
                                <Col 
                                    key={product._id} 
                                    xs={24} 
                                    sm={12} 
                                    md={8} 
                                    lg={6} 
                                    xl={6}
                                >
                                    <ProductCard
                                        product={product}
                                        onViewDetail={handleViewDetail}
                                        onAddToCart={handleAddToCart}
                                        showHighlight={true}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}

                {/* No Results */}
                {!loading && products.length === 0 && query && (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <SearchOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                            <Title level={4} type="secondary">
                                Không tìm thấy sản phẩm nào
                            </Title>
                            <Text type="secondary">
                                Không có sản phẩm nào phù hợp với từ khóa "{query}"
                            </Text>
                            <div style={{ marginTop: '24px' }}>
                                <Text strong>Gợi ý:</Text>
                                <ul style={{ textAlign: 'left', marginTop: '8px' }}>
                                    <li>Kiểm tra lại chính tả</li>
                                    <li>Thử sử dụng từ khóa khác</li>
                                    <li>Sử dụng từ khóa ngắn gọn hơn</li>
                                    <li>Thử tìm kiếm với từ đồng nghĩa</li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Popular Searches */}
                {popularSearches.length > 0 && (
                    <Card title="Tìm kiếm phổ biến">
                        <Space wrap>
                            {popularSearches.map((search, index) => (
                                <Tag
                                    key={index}
                                    color="blue"
                                    style={{ cursor: 'pointer', marginBottom: '8px' }}
                                    onClick={() => handlePopularSearch(search.term)}
                                >
                                    {search.term} ({search.count})
                                </Tag>
                            ))}
                        </Space>
                    </Card>
                )}

                {/* Empty State */}
                {!query && !loading && (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <SearchOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                            <Title level={4} type="secondary">
                                Tìm kiếm sản phẩm
                            </Title>
                            <Text type="secondary">
                                Sử dụng công cụ tìm kiếm ở trên để tìm sản phẩm bạn muốn
                            </Text>
                        </div>
                    </Card>
                )}
            </Space>
        </div>
    );
};

export default SearchPage;
