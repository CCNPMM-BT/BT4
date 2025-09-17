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
    Statistic,
    InputNumber,
    Modal,
    Descriptions
} from 'antd';
import {
    HeartOutlined,
    HeartFilled,
    ShoppingCartOutlined,
    EyeOutlined,
    StarOutlined,
    MessageOutlined,
    ShoppingOutlined,
    MinusOutlined,
    PlusOutlined,
    ShareAltOutlined,
    LeftOutlined
} from '@ant-design/icons';
import { AuthContext } from '../components/context/auth.context';
import { useCart } from '../components/context/cart.context';
import SimilarProducts from '../components/common/SimilarProducts';
import CommentSystem from '../components/common/CommentSystem';
import PurchaseModal from '../components/common/PurchaseModal';
import {
    getProductByIdApi,
    addToFavoritesApi,
    removeFromFavoritesApi,
    isFavoriteApi,
    addToViewedProductsApi,
    getSimilarProductsApi
} from '../util/apis';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

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
            const response = await getProductByIdApi(id);
            if (response && response.EC === 0) {
                setProduct(response.DT);
                setError(null);
            } else {
                setError(response?.EM || 'Không thể tải thông tin sản phẩm');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
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
        } catch (error) {
            console.error('Error checking favorite status:', error);
        }
    };

    const trackView = async () => {
        try {
            await addToViewedProductsApi(id);
        } catch (error) {
            console.error('Error tracking view:', error);
        }
    };

    const handleFavoriteToggle = async () => {
        if (!auth.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để thêm sản phẩm yêu thích');
            return;
        }

        try {
            setFavoriteLoading(true);
            if (isFavorite) {
                await removeFromFavoritesApi(id);
                setIsFavorite(false);
                message.success('Đã xóa khỏi danh sách yêu thích');
            } else {
                await addToFavoritesApi(id);
                setIsFavorite(true);
                message.success('Đã thêm vào danh sách yêu thích');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            message.error('Có lỗi xảy ra');
        } finally {
            setFavoriteLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!auth.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            return;
        }

        try {
            await addToCart(id, quantity);
            message.success('Đã thêm sản phẩm vào giỏ hàng');
        } catch (error) {
            message.error(error.message || 'Có lỗi xảy ra');
        }
    };

    const handleCommentAdded = () => {
        fetchProductDetail(); // Refresh product data to update comment count
    };

    const handlePurchaseSuccess = () => {
        setShowPurchaseModal(false);
        message.success('Đặt hàng thành công!');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getDiscountPrice = (originalPrice, discount) => {
        return originalPrice * (1 - discount / 100);
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '400px' 
            }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                <Alert
                    message="Lỗi"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <Button size="small" onClick={() => navigate('/products')}>
                            Quay lại danh sách
                        </Button>
                    }
                />
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                <Alert
                    message="Không tìm thấy sản phẩm"
                    description="Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa."
                    type="warning"
                    showIcon
                    action={
                        <Button size="small" onClick={() => navigate('/products')}>
                            Quay lại danh sách
                        </Button>
                    }
                />
            </div>
        );
    }

    const currentPrice = product.discount > 0 ? 
        getDiscountPrice(product.price, product.discount) : 
        product.price;

    return (
        <div style={{ 
            padding: '24px', 
            maxWidth: '1400px', 
            margin: '0 auto',
            background: '#f8f9fa',
            minHeight: '100vh'
        }}>
            {/* Breadcrumb */}
            <div style={{ marginBottom: '24px' }}>
                <Button 
                    type="text" 
                    icon={<LeftOutlined />} 
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: '16px' }}
                >
                    Quay lại
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                {/* Product Images */}
                <Col xs={24} lg={12}>
                    <Card style={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Image
                                src={product.images?.[selectedImage] || '/placeholder-image.jpg'}
                                alt={product.name}
                                style={{ 
                                    maxWidth: '100%', 
                                    maxHeight: '500px',
                                    objectFit: 'contain',
                                    borderRadius: '8px'
                                }}
                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                            />
                        </div>
                        
                        {/* Thumbnail Images */}
                        {product.images && product.images.length > 1 && (
                            <div style={{ 
                                display: 'flex', 
                                gap: '8px', 
                                marginTop: '16px',
                                overflowX: 'auto',
                                padding: '8px 0'
                            }}>
                                {product.images.map((image, index) => (
                                    <Image
                                        key={index}
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        width={80}
                                        height={80}
                                        style={{
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            border: selectedImage === index ? '2px solid #1890ff' : '2px solid transparent'
                                        }}
                                        onClick={() => setSelectedImage(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Product Info */}
                <Col xs={24} lg={12}>
                    <Card style={{ borderRadius: '12px', height: '100%' }}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            {/* Product Title */}
                            <div>
                                <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
                                    {product.name}
                                </Title>
                                <Text type="secondary" style={{ fontSize: '16px' }}>
                                    {product.category?.name}
                                </Text>
                            </div>

                            {/* Rating & Reviews */}
                            <div>
                                <Space align="center" size="large">
                                    <Rate 
                                        disabled 
                                        value={product.rating || 0} 
                                        style={{ fontSize: '18px' }}
                                    />
                                    <Text strong>({product.rating || 0})</Text>
                                    <Text type="secondary">
                                        {product.commentCount || 0} đánh giá
                                    </Text>
                                </Space>
                            </div>

                            {/* Price */}
                            <div>
                                <Space align="baseline" size="large">
                                    <Title level={1} style={{ margin: 0, color: '#dc2626' }}>
                                        {formatPrice(currentPrice)}
                                    </Title>
                                    {product.discount > 0 && (
                                        <>
                                            <Text delete type="secondary" style={{ fontSize: '18px' }}>
                                                {formatPrice(product.price)}
                                            </Text>
                                            <Tag color="red" style={{ fontSize: '14px', padding: '4px 8px' }}>
                                                -{product.discount}%
                                            </Tag>
                                        </>
                                    )}
                                </Space>
                            </div>

                            {/* Stats */}
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Statistic
                                        title="Lượt xem"
                                        value={product.viewCount || 0}
                                        prefix={<EyeOutlined />}
                                        valueStyle={{ fontSize: '16px' }}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                        title="Đã mua"
                                        value={product.purchaseCount || 0}
                                        prefix={<ShoppingOutlined />}
                                        valueStyle={{ fontSize: '16px' }}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                        title="Yêu thích"
                                        value={product.favoriteCount || 0}
                                        prefix={<HeartOutlined />}
                                        valueStyle={{ fontSize: '16px' }}
                                    />
                                </Col>
                            </Row>

                            {/* Quantity & Actions */}
                            <div>
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    <div>
                                        <Text strong>Số lượng:</Text>
                                        <InputNumber
                                            min={1}
                                            max={product.stock || 99}
                                            value={quantity}
                                            onChange={setQuantity}
                                            style={{ marginLeft: '12px', width: '120px' }}
                                            addonBefore={<MinusOutlined />}
                                            addonAfter={<PlusOutlined />}
                                        />
                                        <Text type="secondary" style={{ marginLeft: '8px' }}>
                                            Còn {product.stock || 0} sản phẩm
                                        </Text>
                                    </div>

                                    <Space size="middle" wrap>
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<ShoppingCartOutlined />}
                                            onClick={handleAddToCart}
                                            style={{ 
                                                minWidth: '160px',
                                                height: '48px',
                                                fontSize: '16px',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Thêm vào giỏ
                                        </Button>
                                        
                                        <Button
                                            size="large"
                                            icon={<HeartOutlined />}
                                            onClick={handleFavoriteToggle}
                                            loading={favoriteLoading}
                                            style={{ 
                                                minWidth: '160px',
                                                height: '48px',
                                                fontSize: '16px',
                                                color: isFavorite ? '#ff4d4f' : undefined,
                                                borderColor: isFavorite ? '#ff4d4f' : undefined
                                            }}
                                        >
                                            {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                                        </Button>

                                        <Button
                                            size="large"
                                            icon={<ShareAltOutlined />}
                                            style={{ 
                                                minWidth: '120px',
                                                height: '48px',
                                                fontSize: '16px'
                                            }}
                                        >
                                            Chia sẻ
                                        </Button>
                                    </Space>
                                </Space>
                            </div>

                            {/* Product Details */}
                            <div>
                                <Title level={4}>Thông tin sản phẩm</Title>
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Thương hiệu">
                                        {product.brand || 'Không xác định'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Tình trạng">
                                        <Tag color={product.isActive ? 'green' : 'red'}>
                                            {product.isActive ? 'Còn hàng' : 'Hết hàng'}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Danh mục">
                                        {product.category?.name || 'Không xác định'}
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Product Description & Reviews */}
            <Row gutter={[24, 24]} style={{ marginTop: '32px' }}>
                <Col span={24}>
                    <Card style={{ borderRadius: '12px' }}>
                        <Tabs defaultActiveKey="description" size="large">
                            <TabPane 
                                tab={
                                    <span>
                                        <MessageOutlined />
                                        Mô tả sản phẩm
                                    </span>
                                } 
                                key="description"
                            >
                                <div style={{ padding: '16px 0' }}>
                                    <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                        {product.description || 'Chưa có mô tả chi tiết về sản phẩm.'}
                                    </Paragraph>
                                </div>
                            </TabPane>
                            
                            <TabPane 
                                tab={
                                    <span>
                                        <StarOutlined />
                                        Đánh giá & Bình luận ({product.commentCount || 0})
                                    </span>
                                } 
                                key="reviews"
                            >
                                <CommentSystem 
                                    productId={id}
                                    onCommentAdded={handleCommentAdded}
                                />
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>

            {/* Similar Products */}
            <Row style={{ marginTop: '32px' }}>
                <Col span={24}>
                    <SimilarProducts productId={id} />
                </Col>
            </Row>

            {/* Purchase Modal */}
            <PurchaseModal
                visible={showPurchaseModal}
                onCancel={() => setShowPurchaseModal(false)}
                onSuccess={handlePurchaseSuccess}
                product={product}
                quantity={quantity}
            />
        </div>
    );
};

export default ProductDetailPage;
