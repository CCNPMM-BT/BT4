import React, { useContext, useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Spin, Alert, Space } from 'antd';
import { 
    UserOutlined, 
    MailOutlined, 
    HomeOutlined, 
    AppstoreOutlined,
    ShoppingOutlined,
    StarOutlined
} from '@ant-design/icons';
import { AuthContext } from '../components/context/auth.context';
import { useNavigate } from 'react-router-dom';
import { getAllCategoriesApi, getAllProductsApi } from '../util/apis';
import CategoryCard from '../components/common/CategoryCard';
import ProductCard from '../components/common/ProductCard';

const { Title, Text } = Typography;

const HomePage = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch categories
            const categoriesResponse = await getAllCategoriesApi();
            if (categoriesResponse && categoriesResponse.EC === 0) {
                setCategories(categoriesResponse.DT?.slice(0, 4) || []); // Show only first 4 categories
            }

            // Fetch featured products
            const productsResponse = await getAllProductsApi(1, 8);
            if (productsResponse && productsResponse.EC === 0) {
                setFeaturedProducts(productsResponse.DT?.products?.slice(0, 8) || []); // Show only first 8 products
            }
        } catch (err) {
            console.error('Error fetching home data:', err);
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (product) => {
        navigate(`/product/${product._id}`);
    };

    const handleAddToCart = (product) => {
        // TODO: Implement add to cart functionality
        console.log('Add to cart:', product);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '20px' }}>Đang tải dữ liệu...</div>
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
            />
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Welcome Section */}
                <Row justify="center">
                    <Col xs={24} md={16} lg={12}>
                        <Card>
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <HomeOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                                <Title level={2}>Chào mừng đến với cửa hàng của chúng tôi</Title>
                            </div>
                            
                            {auth.isAuthenticated ? (
                                <div>
                                    <Card 
                                        title="Thông tin người dùng" 
                                        style={{ marginBottom: '20px' }}
                                        extra={<Button type="primary" onClick={() => navigate('/user')}>Xem người dùng</Button>}
                                    >
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                    <UserOutlined style={{ marginRight: '8px' }} />
                                                    <Text strong>Tên: </Text>
                                                    <Text style={{ marginLeft: '8px' }}>{auth.user.name}</Text>
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                    <MailOutlined style={{ marginRight: '8px' }} />
                                                    <Text strong>Email: </Text>
                                                    <Text style={{ marginLeft: '8px' }}>{auth.user.email}</Text>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                    
                                    <div style={{ textAlign: 'center' }}>
                                        <Text type="secondary">
                                            Bạn đã đăng nhập thành công. Bây giờ bạn có thể truy cập tất cả tính năng của ứng dụng.
                                        </Text>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <Text type="secondary" style={{ fontSize: '16px', marginBottom: '20px', display: 'block' }}>
                                        Vui lòng đăng nhập để truy cập các tính năng của ứng dụng
                                    </Text>
                                    <Button type="primary" size="large" onClick={() => navigate('/login')}>
                                        Đăng nhập
                                    </Button>
                                    <Button size="large" style={{ marginLeft: '10px' }} onClick={() => navigate('/register')}>
                                        Đăng ký
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>

                {/* Categories Section */}
                {categories.length > 0 && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <Title level={3} style={{ margin: 0 }}>
                                <AppstoreOutlined /> Danh mục sản phẩm
                            </Title>
                            <Button type="link" onClick={() => navigate('/categories')}>
                                Xem tất cả
                            </Button>
                        </div>
                        
                        <Row gutter={[24, 24]}>
                            {categories.map((category) => (
                                <Col key={category._id} xs={24} sm={12} md={6} lg={6} xl={6}>
                                    <CategoryCard category={category} />
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}

                {/* Featured Products Section */}
                {featuredProducts.length > 0 && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <Title level={3} style={{ margin: 0 }}>
                                <StarOutlined /> Sản phẩm nổi bật
                            </Title>
                            <Button type="link" onClick={() => navigate('/products')}>
                                Xem tất cả
                            </Button>
                        </div>
                        
                        <Row gutter={[24, 24]}>
                            {featuredProducts.map((product) => (
                                <Col key={product._id} xs={24} sm={12} md={8} lg={6} xl={6}>
                                    <ProductCard
                                        product={product}
                                        onViewDetail={handleViewDetail}
                                        onAddToCart={handleAddToCart}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </Space>
        </div>
    );
};

export default HomePage;