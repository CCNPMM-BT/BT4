import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Spin, Alert, Button, Empty } from 'antd';
import { HeartOutlined, DeleteOutlined } from '@ant-design/icons';
import { getFavoriteProductsApi } from '../util/apis';
import ProductCard from '../components/common/ProductCard';
import LazyLoading from '../components/common/LazyLoading';

const { Title } = Typography;

const FavoritesPage = () => {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchFavoriteProducts();
    }, []);

    const fetchFavoriteProducts = async (page = 1, reset = true) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            const response = await getFavoriteProductsApi(page, 12);

            if (response && response.EC === 0) {
                const { products: newProducts, pagination } = response.DT;

                if (reset) {
                    setFavoriteProducts(newProducts);
                } else {
                    setFavoriteProducts(prev => [...prev, ...newProducts]);
                }

                setCurrentPage(page);
                setHasMore(pagination.hasNextPage);
            } else {
                setError(response?.EM || 'Không thể tải danh sách sản phẩm yêu thích');
            }
        } catch (err) {
            console.error('Error fetching favorite products:', err);
            setError('Có lỗi xảy ra khi tải danh sách sản phẩm yêu thích');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            fetchFavoriteProducts(currentPage + 1, false);
        }
    };

    const handleViewDetail = (product) => {
        // Navigate to product detail page
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
                <div style={{ marginTop: '20px' }}>Đang tải sản phẩm yêu thích...</div>
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
                    <Button size="small" onClick={() => fetchFavoriteProducts()}>
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
            <div style={{
                background: 'var(--accent-color)',
                borderRadius: 'var(--radius-2xl)',
                padding: 'var(--space-2xl)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)'
            }}>
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <HeartOutlined style={{ 
                        fontSize: '48px', 
                        color: '#ff4d4f',
                        marginBottom: '16px'
                    }} />
                    <Title level={2} style={{ 
                        color: 'var(--text-color)',
                        margin: 0,
                        fontWeight: '600'
                    }}>
                        Sản phẩm yêu thích
                    </Title>
                    <p style={{ 
                        color: 'var(--text-secondary)',
                        fontSize: '16px',
                        margin: '8px 0 0 0'
                    }}>
                        Danh sách sản phẩm bạn đã thêm vào yêu thích
                    </p>
                </div>

                {favoriteProducts.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Chưa có sản phẩm yêu thích nào"
                        style={{ padding: '60px 0' }}
                    >
                        <Button type="primary" href="/products">
                            Khám phá sản phẩm
                        </Button>
                    </Empty>
                ) : (
                    <LazyLoading
                        onLoadMore={handleLoadMore}
                        hasMore={hasMore}
                        loading={loadingMore}
                        error={error}
                    >
                        <Row gutter={[24, 24]}>
                            {favoriteProducts.map((product) => (
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
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
