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
    Card,
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
    advancedSearchProductsApi
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
    const [searchResults, setSearchResults] = useState(null);
    const [useAdvancedSearch, setUseAdvancedSearch] = useState(false);

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

    // Handle advanced search results
    const handleAdvancedSearchResults = (results) => {
        setSearchResults(results);
        setUseAdvancedSearch(true);
        setProducts(results.products || []);
        setCurrentPage(results.pagination?.currentPage || 1);
        setHasMore(results.pagination?.hasNextPage || false);
    };

    // Handle advanced search loading
    const handleAdvancedSearchLoading = (isLoading) => {
        setLoading(isLoading);
    };

    // Switch back to normal view
    const handleBackToNormal = () => {
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
        <div style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh'
        }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>

                {/* Advanced Search Component */}
                <AdvancedSearch
                    onSearchResults={handleAdvancedSearchResults}
                    onLoading={handleAdvancedSearchLoading}
                    categories={categories}
                    initialFilters={{
                        query: searchTerm,
                        category: selectedCategory,
                        sortBy: sortBy
                    }}
                />


                {/* Products Grid */}
                <div style={{
                    background: 'var(--accent-color)',
                    borderRadius: 'var(--radius-2xl)',
                    padding: 'var(--space-2xl)',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-light)'
                }}>
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
                        <div className="empty-container">
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, var(--gray-200) 0%, var(--gray-300) 100%)',
                                borderRadius: 'var(--radius-full)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 'var(--space-6)'
                            }}>
                                <SearchOutlined style={{
                                    fontSize: '32px',
                                    color: 'var(--gray-500)'
                                }} />
                            </div>
                            <Title level={3} style={{
                                color: 'var(--gray-700)',
                                marginBottom: 'var(--space-4)',
                                fontWeight: '600'
                            }}>
                                Không tìm thấy sản phẩm nào
                            </Title>
                            <Text style={{
                                color: 'var(--gray-500)',
                                fontSize: 'var(--font-size-lg)',
                                display: 'block',
                                marginBottom: 'var(--space-8)',
                                maxWidth: '400px',
                                lineHeight: '1.6'
                            }}>
                                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy sản phẩm phù hợp
                            </Text>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleBackToNormal}
                                style={{
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)',
                                    border: 'none',
                                    boxShadow: 'var(--shadow-md)',
                                    height: '48px',
                                    padding: '0 32px',
                                    fontWeight: '600'
                                }}
                            >
                                Thử lại
                            </Button>
                        </div>
                    )}
                </div>
            </Space>
        </div>
    );
};

export default ProductsPage;


