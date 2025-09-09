import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Row, 
    Col, 
    Typography, 
    Spin, 
    Alert, 
    Space, 
    Input,
    Select,
    Button,
    Breadcrumb
} from 'antd';
import { 
    SearchOutlined,
    HomeOutlined,
    AppstoreOutlined,
    FilterOutlined
} from '@ant-design/icons';
import { 
    getAllProductsApi,
    getAllCategoriesApi,
    searchProductsApi
} from '../util/apis';
import ProductCard from '../components/common/ProductCard';
import LazyLoading from '../components/common/LazyLoading';
import AdvancedSearch from '../components/common/AdvancedSearch';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductsPage = () => {
    const navigate = useNavigate();
    
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [useAdvancedSearch, setUseAdvancedSearch] = useState(false);
    const [searchResults, setSearchResults] = useState(null);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategoriesApi();
            if (response && response.EC === 0) {
                setCategories(response.DT || []);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchProducts = async (page = 1, reset = true) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            const response = await getAllProductsApi(page, 12, searchTerm);
            
            if (response && response.EC === 0) {
                const { products: newProducts, pagination } = response.DT;
                
                if (reset) {
                    setProducts(newProducts);
                } else {
                    setProducts(prev => [...prev, ...newProducts]);
                }
                
                setCurrentPage(page);
                setHasMore(pagination.hasNextPage);
            } else {
                setError(response?.EM || 'Không thể tải danh sách sản phẩm');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Có lỗi xảy ra khi tải danh sách sản phẩm');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            fetchProducts(currentPage + 1, false);
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
        fetchProducts(1, true);
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        if (value) {
            navigate(`/category/${value}`);
        }
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        // TODO: Implement sorting
        console.log('Sort by:', value);
    };

    const handleViewDetail = (product) => {
        navigate(`/product/${product._id}`);
    };

    const handleAddToCart = (product) => {
        // TODO: Implement add to cart functionality
        console.log('Add to cart:', product);
    };

    const handleAdvancedSearchResults = (results) => {
        setSearchResults(results);
        setProducts(results.products);
        setCurrentPage(results.page);
        setHasMore(results.page < results.totalPages);
        setUseAdvancedSearch(true);
    };

    const handleAdvancedSearchLoading = (isLoading) => {
        setLoading(isLoading);
    };

    const resetToNormalView = () => {
        setUseAdvancedSearch(false);
        setSearchResults(null);
        setSearchTerm('');
        setSelectedCategory('');
        setSortBy('newest');
        fetchProducts();
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '20px' }}>Đang tải sản phẩm...</div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Lỗi tải dữ liệu"
                description={error}
                type="error"
                showIcon
                style={{ margin: '20px' }}
                action={
                    <Button size="small" onClick={() => fetchProducts()}>
                        Thử lại
                    </Button>
                }
            />
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
                            title: 'Tất cả sản phẩm'
                        }
                    ]}
                />

                {/* Header */}
                <div>
                    <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
                        <Col>
                            <Title level={2} style={{ margin: 0 }}>
                                {useAdvancedSearch ? 'Kết quả tìm kiếm' : 'Tất cả sản phẩm'}
                            </Title>
                            {useAdvancedSearch && searchResults && (
                                <Text type="secondary">
                                    Tìm thấy {searchResults.total} sản phẩm
                                </Text>
                            )}
                        </Col>
                        <Col>
                            {useAdvancedSearch && (
                                <Button onClick={resetToNormalView}>
                                    Xem tất cả sản phẩm
                                </Button>
                            )}
                        </Col>
                    </Row>
                    
                    {/* Advanced Search Component */}
                    <AdvancedSearch
                        onSearchResults={handleAdvancedSearchResults}
                        onLoading={handleAdvancedSearchLoading}
                    />
                </div>

                {/* Products Grid */}
                <LazyLoading
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    loading={loadingMore}
                    error={error}
                >
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
                                />
                            </Col>
                        ))}
                    </Row>
                </LazyLoading>

                {products.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Title level={4} type="secondary">
                            Không tìm thấy sản phẩm nào
                        </Title>
                        <Text type="secondary">
                            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                        </Text>
                    </div>
                )}
            </Space>
        </div>
    );
};

export default ProductsPage;

