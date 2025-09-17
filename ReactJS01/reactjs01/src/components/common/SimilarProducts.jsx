import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Spin, Alert, Card } from 'antd';
import { getSimilarProductsApi } from '../../util/apis';
import ProductCard from './ProductCard';

const { Title } = Typography;

const SimilarProducts = ({ productId, onViewDetail, onAddToCart, limit = 6 }) => {
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSimilarProducts = async () => {
            if (!productId) return;
            
            try {
                setLoading(true);
                setError(null);
                
                const response = await getSimilarProductsApi(productId, limit);
                
                if (response && response.EC === 0) {
                    setSimilarProducts(response.DT || []);
                } else {
                    setError(response?.EM || 'Không thể tải sản phẩm tương tự');
                }
            } catch (err) {
                console.error('Error fetching similar products:', err);
                setError('Có lỗi xảy ra khi tải sản phẩm tương tự');
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarProducts();
    }, [productId, limit]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '10px' }}>Đang tải sản phẩm tương tự...</div>
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
                style={{ margin: '20px 0' }}
            />
        );
    }

    if (similarProducts.length === 0) {
        return null;
    }

    return (
        <div style={{ marginTop: '40px' }}>
            <Title level={3} style={{ 
                marginBottom: '24px',
                color: 'var(--text-color)',
                fontWeight: '600'
            }}>
                Sản phẩm tương tự
            </Title>
            
            <Row gutter={[24, 24]}>
                {similarProducts.map((product) => (
                    <Col
                        key={product._id}
                        xs={24}
                        sm={12}
                        md={8}
                        lg={6}
                        xl={4}
                    >
                        <ProductCard
                            product={product}
                            onViewDetail={onViewDetail}
                            onAddToCart={onAddToCart}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default SimilarProducts;
