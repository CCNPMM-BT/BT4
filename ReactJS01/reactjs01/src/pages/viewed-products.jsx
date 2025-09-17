import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Spin, Alert, Button, Empty, Space } from 'antd';
import { EyeOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getViewedProductsApi, clearViewedProductsApi } from '../util/apis';
import ProductCard from '../components/common/ProductCard';
import LazyLoading from '../components/common/LazyLoading';

const { Title, Text } = Typography;

const ViewedProductsPage = () => {
    const [viewedProducts, setViewedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [clearing, setClearing] = useState(false);

    useEffect(() => {
        fetchViewedProducts();
    }, []);

    const fetchViewedProducts = async (page = 1, reset = true) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            const response = await getViewedProductsApi(page, 12);

            if (response && response.EC === 0) {
                const { products: newProducts, pagination } = response.DT;

                if (reset) {
                    setViewedProducts(newProducts);
                } else {
                    setViewedProducts(prev => [...prev, ...newProducts]);
                }

                setCurrentPage(page);
                setHasMore(pagination.hasNextPage);
            } else {
                setError(response?.EM || 'Không thể tải danh sách sản phẩm đã xem');
            }
        } catch (err) {
            console.error('Error fetching viewed products:', err);
            setError('Có lỗi xảy ra khi tải danh sách sản phẩm đã xem');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            fetchViewedProducts(currentPage + 1, false);
        }
    };

    const handleClearAll = async () => {
        try {
            setClearing(true);
            const response = await clearViewedProductsApi();
            
            if (response && response.EC === 0) {
                setViewedProducts([]);
                setCurrentPage(1);
                setHasMore(false);
            } else {
                console.error('Error clearing viewed products:', response?.EM);
            }
        } catch (err) {
            console.error('Error clearing viewed products:', err);
        } finally {
            setClearing(false);
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

    const formatViewTime = (viewedAt) => {
        const now = new Date();
        const viewTime = new Date(viewedAt);
        const diffInHours = Math.floor((now - viewTime) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Vừa xem';
        } else if (diffInHours < 24) {
            return `${diffInHours} giờ trước`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} ngày trước`;
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '20px' }}>Đang tải sản phẩm đã xem...</div>
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
                    <Button size="small" onClick={() => fetchViewedProducts()}>
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
                <div style={{ 
                    marginBottom: '32px', 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <EyeOutlined style={{ 
                        fontSize: '48px', 
                        color: 'var(--primary-color)'
                    }} />
                    <div>
                        <Title level={2} style={{ 
                            color: 'var(--text-color)',
                            margin: 0,
                            fontWeight: '600'
                        }}>
                            Sản phẩm đã xem
                        </Title>
                        <p style={{ 
                            color: 'var(--text-secondary)',
                            fontSize: '16px',
                            margin: '8px 0 0 0'
                        }}>
                            Danh sách sản phẩm bạn đã xem gần đây
                        </p>
                    </div>
                    
                    {viewedProducts.length > 0 && (
                        <Button
                            type="default"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleClearAll}
                            loading={clearing}
                            style={{
                                borderRadius: 'var(--radius-lg)',
                                height: '40px',
                                padding: '0 24px'
                            }}
                        >
                            Xóa tất cả
                        </Button>
                    )}
                </div>

                {viewedProducts.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Chưa có sản phẩm nào được xem"
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
                            {viewedProducts.map((product) => (
                                <Col
                                    key={product._id}
                                    xs={24}
                                    sm={12}
                                    md={8}
                                    lg={6}
                                    xl={6}
                                >
                                    <div style={{ position: 'relative' }}>
                                        <ProductCard
                                            product={product}
                                            onViewDetail={handleViewDetail}
                                            onAddToCart={handleAddToCart}
                                        />
                                        {product.viewedAt && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '8px',
                                                right: '8px',
                                                background: 'rgba(0, 0, 0, 0.7)',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '11px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                zIndex: 10
                                            }}>
                                                <ClockCircleOutlined />
                                                {formatViewTime(product.viewedAt)}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </LazyLoading>
                )}
            </div>
        </div>
    );
};

export default ViewedProductsPage;
