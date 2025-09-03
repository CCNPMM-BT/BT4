import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Row, 
    Col, 
    Typography, 
    Spin, 
    Alert, 
    Space, 
    Button, 
    Input,
    Breadcrumb
} from 'antd';
import { 
    ArrowLeftOutlined, 
    SearchOutlined,
    HomeOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import { 
    getProductsByCategoryApi, 
    getCategoryByIdApi 
} from '../util/apis';
import ProductCard from '../components/common/ProductCard';
import LazyLoading from '../components/common/LazyLoading';

const { Title, Text } = Typography;
const { Search } = Input;

const CategoryProductsPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (categoryId) {
            fetchCategoryAndProducts();
        }
    }, [categoryId]);

    const fetchCategoryAndProducts = async (page = 1, reset = true) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            // Fetch category info
            if (page === 1) {
                const categoryResponse = await getCategoryByIdApi(categoryId);
                if (categoryResponse && categoryResponse.EC === 0) {
                    setCategory(categoryResponse.DT);
                }
            }

            // Fetch products
            const response = await getProductsByCategoryApi(categoryId, page, 12);
            
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
            fetchCategoryAndProducts(currentPage + 1, false);
        }
    };

    const handleViewDetail = (product) => {
        navigate(`/product/${product._id}`);
    };

    const handleAddToCart = (product) => {
        // TODO: Implement add to cart functionality
        console.log('Add to cart:', product);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        // TODO: Implement search functionality
        console.log('Search:', value);
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
                    <Button size="small" onClick={() => fetchCategoryAndProducts()}>
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
                            title: (
                                <span onClick={() => navigate('/categories')} style={{ cursor: 'pointer' }}>
                                    <AppstoreOutlined /> Danh mục
                                </span>
                            )
                        },
                        {
                            title: category?.name || 'Danh mục'
                        }
                    ]}
                />

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                        <Button 
                            icon={<ArrowLeftOutlined />} 
                            onClick={() => navigate('/categories')}
                        >
                            Quay lại
                        </Button>
                        <Title level={2} style={{ margin: 0 }}>
                            {category?.name || 'Danh mục sản phẩm'}
                        </Title>
                    </Space>
                    
                    <Search
                        placeholder="Tìm kiếm sản phẩm..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        style={{ width: 300 }}
                        onSearch={handleSearch}
                    />
                </div>

                {category?.description && (
                    <Text type="secondary" style={{ fontSize: '16px' }}>
                        {category.description}
                    </Text>
                )}

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
                            Chưa có sản phẩm nào trong danh mục này
                        </Title>
                    </div>
                )}
            </Space>
        </div>
    );
};

export default CategoryProductsPage;

