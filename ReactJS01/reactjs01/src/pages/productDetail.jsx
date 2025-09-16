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
    Card,
    Rate,
    Input,
    message,
    Tag,
    Divider,
    Image,
    Badge,
    Tooltip
} from 'antd';
import { 
    HeartOutlined,
    HeartFilled,
    EyeOutlined,
    StarOutlined,
    ShoppingCartOutlined,
    ArrowLeftOutlined,
    FireOutlined,
    GiftOutlined
} from '@ant-design/icons';
import { 
    getProductByIdApi,
    getRelatedProductsApi,
    getProductReviewsApi,
    createProductReviewApi,
    toggleFavoriteApi,
    checkFavoriteStatusApi
} from '../util/apis';
import ProductCard from '../components/common/ProductCard';
import { useContext } from 'react';
import { AuthContext } from '../components/context/auth.context';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const user = auth.user;
    
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingRelated, setLoadingRelated] = useState(false);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [reviewLoading, setReviewLoading] = useState(false);
    
    // Review form state
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');

    useEffect(() => {
        if (id) {
            fetchProductDetail();
            fetchRelatedProducts();
            fetchReviews();
            if (user) {
                checkFavoriteStatus();
            }
        }
    }, [id, user]);

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

    const fetchRelatedProducts = async () => {
        try {
            setLoadingRelated(true);
            const response = await getRelatedProductsApi(id, 4);
            if (response && response.EC === 0) {
                setRelatedProducts(response.DT);
            }
        } catch (err) {
            console.error('Error fetching related products:', err);
        } finally {
            setLoadingRelated(false);
        }
    };

    const fetchReviews = async () => {
        try {
            setLoadingReviews(true);
            const response = await getProductReviewsApi(id, 1, 10);
            if (response && response.EC === 0) {
                setReviews(response.DT.reviews);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoadingReviews(false);
        }
    };

    const checkFavoriteStatus = async () => {
        try {
            const response = await checkFavoriteStatusApi(id);
            if (response && response.EC === 0) {
                setIsFavorite(response.DT.isFavorite);
            }
        } catch (err) {
            console.error('Error checking favorite status:', err);
        }
    };

    const handleToggleFavorite = async () => {
        if (!user) {
            message.warning('Vui lòng đăng nhập để thêm vào yêu thích');
            return;
        }

        try {
            setFavoriteLoading(true);
            const response = await toggleFavoriteApi(id);
            if (response && response.EC === 0) {
                setIsFavorite(response.DT.isFavorite);
                message.success(response.EM);
            } else {
                message.error(response?.EM || 'Có lỗi xảy ra');
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
            message.error('Có lỗi xảy ra khi cập nhật yêu thích');
        } finally {
            setFavoriteLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        if (!user) {
            message.warning('Vui lòng đăng nhập để đánh giá sản phẩm');
            return;
        }

        if (reviewRating === 0) {
            message.warning('Vui lòng chọn điểm đánh giá');
            return;
        }

        try {
            setReviewLoading(true);
            const response = await createProductReviewApi(id, reviewRating, reviewComment);
            if (response && response.EC === 0) {
                message.success('Đánh giá của bạn đã được gửi thành công');
                setReviewRating(0);
                setReviewComment('');
                fetchReviews();
                fetchProductDetail(); // Refresh product to update rating
            } else {
                message.error(response?.EM || 'Có lỗi xảy ra');
            }
        } catch (err) {
            console.error('Error submitting review:', err);
            message.error('Có lỗi xảy ra khi gửi đánh giá');
        } finally {
            setReviewLoading(false);
        }
    };

    const handleViewDetail = (product) => {
        navigate(`/product/${product._id}`);
    };

    const handleAddToCart = (product) => {
        // TODO: Implement add to cart functionality
        console.log('Add to cart:', product);
        message.info('Tính năng giỏ hàng đang được phát triển');
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
            <div style={{ padding: '20px' }}>
                <Alert
                    message="Lỗi tải dữ liệu"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <Button size="small" onClick={() => navigate(-1)}>
                            Quay lại
                        </Button>
                    }
                />
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ padding: '20px' }}>
                <Alert
                    message="Không tìm thấy sản phẩm"
                    description="Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa."
                    type="warning"
                    showIcon
                    action={
                        <Button size="small" onClick={() => navigate(-1)}>
                            Quay lại
                        </Button>
                    }
                />
            </div>
        );
    }

    const discount = calculateDiscount(product.originalPrice, product.price);

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{ marginBottom: '20px' }}>
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: '10px' }}
                >
                    Quay lại
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                {/* Product Images */}
                <Col xs={24} lg={12}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            {product.images && product.images.length > 0 ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                    preview={{
                                        mask: 'Xem ảnh'
                                    }}
                                />
                            ) : (
                                <div style={{ 
                                    height: '300px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    backgroundColor: '#f5f5f5',
                                    color: '#999'
                                }}>
                                    Không có ảnh
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>

                {/* Product Info */}
                <Col xs={24} lg={12}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        {/* Product Title and Badges */}
                        <div>
                            <div style={{ marginBottom: '10px' }}>
                                {product.isFeatured && (
                                    <Tag color="red" icon={<FireOutlined />} style={{ marginRight: '8px' }}>
                                        Nổi bật
                                    </Tag>
                                )}
                                {product.isOnSale && (
                                    <Tag color="orange" icon={<GiftOutlined />} style={{ marginRight: '8px' }}>
                                        Đang khuyến mãi
                                    </Tag>
                                )}
                                {discount > 0 && (
                                    <Tag color="green">
                                        -{discount}%
                                    </Tag>
                                )}
                            </div>
                            <Title level={2} style={{ margin: 0 }}>
                                {product.name}
                            </Title>
                        </div>

                        {/* Rating and Reviews */}
                        <div>
                            <Space>
                                <Rate 
                                    disabled 
                                    value={product.rating || 0} 
                                    allowHalf 
                                />
                                <Text type="secondary">
                                    ({product.reviewCount || 0} đánh giá)
                                </Text>
                            </Space>
                        </div>

                        {/* Price */}
                        <div>
                            <Space direction="vertical" size="small">
                                <div>
                                    <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                                        {formatPrice(product.price)}
                                    </Text>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <Text 
                                            delete 
                                            type="secondary" 
                                            style={{ marginLeft: '10px', fontSize: '16px' }}
                                        >
                                            {formatPrice(product.originalPrice)}
                                        </Text>
                                    )}
                                </div>
                                {discount > 0 && (
                                    <Text type="success">
                                        Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                                    </Text>
                                )}
                            </Space>
                        </div>

                        {/* Product Stats */}
                        <div>
                            <Space size="large">
                                <Tooltip title="Lượt xem">
                                    <Space>
                                        <EyeOutlined />
                                        <Text>{product.viewCount || 0}</Text>
                                    </Space>
                                </Tooltip>
                                <Tooltip title="Yêu thích">
                                    <Space>
                                        <HeartOutlined />
                                        <Text>{product.favoriteCount || 0}</Text>
                                    </Space>
                                </Tooltip>
                                <Tooltip title="Đánh giá">
                                    <Space>
                                        <StarOutlined />
                                        <Text>{product.reviewCount || 0}</Text>
                                    </Space>
                                </Tooltip>
                            </Space>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div>
                                <Title level={4}>Mô tả sản phẩm</Title>
                                <Paragraph>{product.description}</Paragraph>
                            </div>
                        )}

                        {/* Stock Status */}
                        <div>
                            <Text strong>
                                Tình trạng: 
                                <Text type={product.stock > 0 ? 'success' : 'danger'} style={{ marginLeft: '8px' }}>
                                    {product.stock > 0 ? `Còn hàng (${product.stock} sản phẩm)` : 'Hết hàng'}
                                </Text>
                            </Text>
                        </div>

                        {/* Action Buttons */}
                        <div>
                            <Space size="middle">
                                <Button 
                                    type="primary" 
                                    size="large"
                                    icon={<ShoppingCartOutlined />}
                                    disabled={product.stock === 0}
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Thêm vào giỏ hàng
                                </Button>
                                <Button 
                                    size="large"
                                    icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                                    loading={favoriteLoading}
                                    onClick={handleToggleFavorite}
                                    style={{ 
                                        color: isFavorite ? '#ff4d4f' : undefined,
                                        borderColor: isFavorite ? '#ff4d4f' : undefined
                                    }}
                                >
                                    {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                                </Button>
                            </Space>
                        </div>

                        {/* Category */}
                        {product.category && (
                            <div>
                                <Text type="secondary">
                                    Danh mục: <Text strong>{product.category.name}</Text>
                                </Text>
                            </div>
                        )}
                    </Space>
                </Col>
            </Row>

            <Divider />

            {/* Reviews Section */}
            <div style={{ marginTop: '40px' }}>
                <Title level={3}>Đánh giá sản phẩm</Title>
                
                {/* Review Form */}
                {user && (
                    <Card style={{ marginBottom: '20px' }}>
                        <Title level={4}>Viết đánh giá</Title>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <div>
                                <Text strong>Điểm đánh giá: </Text>
                                <Rate 
                                    value={reviewRating} 
                                    onChange={setReviewRating}
                                />
                            </div>
                            <div>
                                <Text strong>Nhận xét: </Text>
                                <TextArea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                    rows={4}
                                    style={{ marginTop: '8px' }}
                                />
                            </div>
                            <Button 
                                type="primary" 
                                loading={reviewLoading}
                                onClick={handleSubmitReview}
                            >
                                Gửi đánh giá
                            </Button>
                        </Space>
                    </Card>
                )}

                {/* Reviews List */}
                <div>
                    {loadingReviews ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <Spin />
                        </div>
                    ) : reviews.length > 0 ? (
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            {reviews.map((review) => (
                                <Card key={review._id} size="small">
                                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                        <div>
                                            <Space>
                                                <Text strong>{review.user?.name || 'Người dùng'}</Text>
                                                <Rate disabled value={review.rating} />
                                                <Text type="secondary">
                                                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                                </Text>
                                            </Space>
                                        </div>
                                        {review.comment && (
                                            <Paragraph style={{ margin: 0 }}>
                                                {review.comment}
                                            </Paragraph>
                                        )}
                                    </Space>
                                </Card>
                            ))}
                        </Space>
                    ) : (
                        <Card>
                            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                Chưa có đánh giá nào cho sản phẩm này
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            <Divider />

            {/* Related Products */}
            <div style={{ marginTop: '40px' }}>
                <Title level={3}>Sản phẩm liên quan</Title>
                {loadingRelated ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin />
                    </div>
                ) : relatedProducts.length > 0 ? (
                    <Row gutter={[16, 16]}>
                        {relatedProducts.map((relatedProduct) => (
                            <Col xs={12} sm={8} md={6} key={relatedProduct._id}>
                                <ProductCard
                                    product={relatedProduct}
                                    onViewDetail={handleViewDetail}
                                    onAddToCart={handleAddToCart}
                                />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                            Không có sản phẩm liên quan
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
