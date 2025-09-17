import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Row,
    Col,
    Typography,
    Spin,
    Alert,
    Button,
    Space,
    Card,
    Image,
    Rate,
    Divider,
    Tag,
    Badge,
    message,
    Tabs,
    Input,
    Form,
    List,
    Avatar,
    Tooltip,
    Statistic
} from 'antd';
import {
    HeartOutlined,
    HeartFilled,
    ShoppingCartOutlined,
    EyeOutlined,
    StarOutlined,
    MessageOutlined,
    ShoppingOutlined,
    UserOutlined,
    LikeOutlined,
    DislikeOutlined
} from '@ant-design/icons';
import {
    getProductByIdApi,
    addToFavoritesApi,
    removeFromFavoritesApi,
    isFavoriteApi,
    addToViewedProductsApi,
    getSimilarProductsApi
} from '../util/apis';
import { AuthContext } from '../components/context/auth.context';
import SimilarProducts from '../components/common/SimilarProducts';
import CommentSystem from '../components/common/CommentSystem';
import PurchaseModal from '../components/common/PurchaseModal';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProductDetail();
            if (auth.isAuthenticated) {
                checkFavoriteStatus();
                trackView();
            }
        }
    }, [id, auth.isAuthenticated]);

    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await getProductByIdApi(id);
            
            if (response && response.EC === 0) {
                setProduct(response.DT);
            } else {
                setError(response?.EM || 'Không thể tải thông tin sản phẩm');
            }
        } catch (err) {
            console.error('Error fetching product:', err);
            setError('Có lỗi xảy ra khi tải thông tin sản phẩm');
        } finally {
            setLoading(false);
        }
    };


    const checkFavoriteStatus = async () => {
        try {
            const response = await isFavoriteApi(id);
            if (response && response.EC === 0) {
                setIsFavorite(response.DT);
            }
        } catch (err) {
            console.error('Error checking favorite status:', err);
        }
    };

    const trackView = async () => {
        try {
            await addToViewedProductsApi(id);
        } catch (err) {
            console.error('Error tracking view:', err);
        }
    };

    const handleFavoriteToggle = async () => {
        if (!auth.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để sử dụng chức năng này');
            navigate('/login');
            return;
        }

        setFavoriteLoading(true);
        
        try {
            if (isFavorite) {
                const response = await removeFromFavoritesApi(id);
                if (response && response.EC === 0) {
                    setIsFavorite(false);
                    message.success('Đã xóa khỏi danh sách yêu thích');
                } else {
                    message.error(response?.EM || 'Có lỗi xảy ra');
                }
            } else {
                const response = await addToFavoritesApi(id);
                if (response && response.EC === 0) {
                    setIsFavorite(true);
                    message.success('Đã thêm vào danh sách yêu thích');
                } else {
                    message.error(response?.EM || 'Có lỗi xảy ra');
                }
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
            message.error('Có lỗi xảy ra khi cập nhật danh sách yêu thích');
        } finally {
            setFavoriteLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!auth.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để thêm vào giỏ hàng');
            navigate('/login');
            return;
        }
        // TODO: Implement add to cart
        message.info('Chức năng giỏ hàng đang được phát triển');
    };

    const handleBuyNow = () => {
        if (!auth.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để mua hàng');
            navigate('/login');
            return;
        }
        setShowPurchaseModal(true);
    };

    const handleCommentAdded = () => {
        // Refresh product stats when comment is added
        fetchProductDetail();
    };

    const handlePurchaseSuccess = () => {
        // Refresh product stats when purchase is made
        fetchProductDetail();
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const calculateDiscount = (originalPrice, currentPrice) => {
        if (!originalPrice || originalPrice <= currentPrice) return 0;
        return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '20px' }}>Đang tải thông tin sản phẩm...</div>
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
                    <Button size="small" onClick={fetchProductDetail}>
                        Thử lại
                    </Button>
                }
            />
        );
    }

    if (!product) {
        return (
            <Alert
                message="Không tìm thấy sản phẩm"
                description="Sản phẩm không tồn tại hoặc đã bị xóa"
                type="warning"
                showIcon
                style={{ margin: '20px' }}
            />
        );
    }

    const discount = calculateDiscount(product.originalPrice, product.price);

    return (
        <div style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh'
        }}>
            <div style={{
                background: 'var(--accent-color)',
                borderRadius: 'var(--radius-2xl)',
                padding: 'var(--space-2xl)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)'
            }}>
                <Row gutter={[32, 32]}>
                    {/* Product Images */}
                    <Col xs={24} lg={12}>
                        <div style={{ position: 'relative' }}>
                            <Image
                                src={product.images?.[0] || '/placeholder.jpg'}
                                alt={product.name}
                                style={{
                                    width: '100%',
                                    height: '400px',
                                    objectFit: 'cover',
                                    borderRadius: 'var(--radius-xl)'
                                }}
                                preview={{
                                    mask: 'Xem ảnh'
                                }}
                            />
                            
                            {/* Discount Badge */}
                            {discount > 0 && (
                                <Badge
                                    count={`-${discount}%`}
                                    style={{
                                        position: 'absolute',
                                        top: '16px',
                                        left: '16px',
                                        backgroundColor: '#ff4d4f',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                />
                            )}

                            {/* Favorite Button */}
                            <Tooltip title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}>
                                <Button
                                    type="text"
                                    shape="circle"
                                    icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                                    onClick={handleFavoriteToggle}
                                    loading={favoriteLoading}
                                    style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        width: '48px',
                                        height: '48px',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        border: 'none',
                                        color: isFavorite ? '#ff4d4f' : '#8c8c8c',
                                        fontSize: '20px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                    }}
                                />
                            </Tooltip>
                        </div>
                    </Col>

                    {/* Product Info */}
                    <Col xs={24} lg={12}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Title level={2} style={{ margin: 0, color: 'var(--text-color)' }}>
                                    {product.name}
                                </Title>
                                
                                {/* Rating */}
                                <div style={{ marginTop: '8px' }}>
                                    <Space>
                                        <Rate
                                            disabled
                                            value={product.rating || 0}
                                            style={{ color: '#faad14' }}
                                        />
                                        <Text style={{ color: 'var(--text-secondary)' }}>
                                            {product.rating?.toFixed(1) || 0} ({product.reviewCount || 0} đánh giá)
                                        </Text>
                                    </Space>
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <Space align="baseline" size="large">
                                    <Text style={{ 
                                        fontSize: '28px', 
                                        fontWeight: 'bold',
                                        color: '#ff4d4f'
                                    }}>
                                        {formatPrice(product.price)}
                                    </Text>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <Text delete style={{ 
                                            fontSize: '18px', 
                                            color: 'var(--text-light)'
                                        }}>
                                            {formatPrice(product.originalPrice)}
                                        </Text>
                                    )}
                                </Space>
                            </div>

                            {/* Stats */}
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Statistic
                                        title="Đã mua"
                                        value={product.purchaseCount || 0}
                                        prefix={<ShoppingOutlined />}
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                        title="Bình luận"
                                        value={product.commentCount || 0}
                                        prefix={<MessageOutlined />}
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                        title="Yêu thích"
                                        value={product.favoriteCount || 0}
                                        prefix={<HeartOutlined />}
                                        valueStyle={{ color: '#ff4d4f' }}
                                    />
                                </Col>
                            </Row>

                            {/* Description */}
                            {product.description && (
                                <div>
                                    <Title level={4}>Mô tả sản phẩm</Title>
                                    <Paragraph>{product.description}</Paragraph>
                                </div>
                            )}

                            {/* Tags */}
                            {product.tags && product.tags.length > 0 && (
                                <div>
                                    <Text strong>Tags: </Text>
                                    <Space wrap>
                                        {product.tags.map((tag, index) => (
                                            <Tag key={index} color="blue">{tag}</Tag>
                                        ))}
                                    </Space>
                                </div>
                            )}

                            {/* Stock Status */}
                            <div>
                                <Tag color={product.stock > 10 ? 'green' : product.stock > 0 ? 'orange' : 'red'}>
                                    {product.stock > 10 ? 'Còn hàng' : product.stock > 0 ? 'Sắp hết' : 'Hết hàng'} 
                                    • {product.stock} sản phẩm
                                </Tag>
                            </div>

                            {/* Action Buttons */}
                            <Space size="middle">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<ShoppingCartOutlined />}
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    style={{
                                        height: '48px',
                                        padding: '0 32px',
                                        fontSize: '16px',
                                        fontWeight: '600'
                                    }}
                                >
                                    Thêm vào giỏ
                                </Button>
                                
                                <Button
                                    type="default"
                                    size="large"
                                    onClick={handleBuyNow}
                                    disabled={product.stock === 0}
                                    style={{
                                        height: '48px',
                                        padding: '0 32px',
                                        fontSize: '16px',
                                        fontWeight: '600'
                                    }}
                                >
                                    Mua ngay
                                </Button>
                            </Space>
                        </Space>
                    </Col>
                </Row>

                <Divider />

                {/* Tabs */}
                <Tabs defaultActiveKey="comments">
                    <TabPane tab="Bình luận & Đánh giá" key="comments">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={16}>
                                <CommentSystem 
                                    productId={id} 
                                    onCommentAdded={handleCommentAdded}
                                />
                            </Col>
                            
                            <Col xs={24} lg={8}>
                                {/* Product Stats */}
                                <Card title="Thống kê sản phẩm">
                                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                        <Statistic
                                            title="Lượt xem"
                                            value={product.viewCount || 0}
                                            prefix={<EyeOutlined />}
                                        />
                                        <Statistic
                                            title="Đã bán"
                                            value={product.purchaseCount || 0}
                                            prefix={<ShoppingOutlined />}
                                        />
                                        <Statistic
                                            title="Đánh giá trung bình"
                                            value={product.rating || 0}
                                            precision={1}
                                            prefix={<StarOutlined />}
                                        />
                                        <Statistic
                                            title="Số bình luận"
                                            value={product.commentCount || 0}
                                            prefix={<MessageOutlined />}
                                        />
                                    </Space>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>

                {/* Similar Products */}
                <SimilarProducts
                    productId={id}
                    onViewDetail={(product) => navigate(`/product/${product._id}`)}
                    onAddToCart={handleAddToCart}
                    limit={8}
                />
            </div>

            {/* Purchase Modal */}
            <PurchaseModal
                visible={showPurchaseModal}
                onCancel={() => setShowPurchaseModal(false)}
                product={product}
                onSuccess={handlePurchaseSuccess}
            />
        </div>
    );
};

export default ProductDetailPage;
