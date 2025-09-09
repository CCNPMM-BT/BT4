import React from 'react';
import { Card, Image, Typography, Space, Tag, Button } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ProductCard = ({ product, onViewDetail, onAddToCart, showHighlight = false }) => {
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

    const discount = calculateDiscount(product.originalPrice, product.price);

    return (
        <Card
            hoverable
            cover={
                <div style={{ position: 'relative' }}>
                    <Image
                        alt={product.name}
                        src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
                        style={{ height: 200, objectFit: 'cover' }}
                        preview={false}
                    />
                    {discount > 0 && (
                        <Tag 
                            color="red" 
                            style={{ 
                                position: 'absolute', 
                                top: 8, 
                                left: 8,
                                margin: 0
                            }}
                        >
                            -{discount}%
                        </Tag>
                    )}
                    {product.stock === 0 && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}>
                            Hết hàng
                        </div>
                    )}
                </div>
            }
            actions={[
                <Button 
                    type="primary" 
                    icon={<EyeOutlined />} 
                    onClick={() => onViewDetail(product)}
                    block
                >
                    Xem chi tiết
                </Button>,
                <Button 
                    type="default" 
                    icon={<ShoppingCartOutlined />} 
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock === 0}
                    block
                >
                    Thêm vào giỏ
                </Button>
            ]}
        >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Title level={5} style={{ margin: 0, minHeight: 40 }}>
                    {showHighlight && product.highlight?.name ? (
                        <span dangerouslySetInnerHTML={{ 
                            __html: product.highlight.name[0] 
                        }} />
                    ) : (
                        product.name
                    )}
                </Title>
                
                {showHighlight && product.highlight?.description && (
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        <span dangerouslySetInnerHTML={{ 
                            __html: product.highlight.description[0] 
                        }} />
                    </div>
                )}
                
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Space>
                        <Text strong style={{ fontSize: '16px', color: '#ff4d4f' }}>
                            {formatPrice(product.price)}
                        </Text>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <Text delete style={{ fontSize: '14px', color: '#999' }}>
                                {formatPrice(product.originalPrice)}
                            </Text>
                        )}
                    </Space>
                    
                    {product.rating > 0 && (
                        <Space>
                            <Text style={{ fontSize: '12px' }}>
                                ⭐ {product.rating.toFixed(1)} ({product.reviewCount} đánh giá)
                            </Text>
                        </Space>
                    )}
                    
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        Còn lại: {product.stock} sản phẩm
                    </Text>
                    
                    {product.tags && product.tags.length > 0 && (
                        <Space wrap>
                            {product.tags.slice(0, 2).map((tag, index) => (
                                <Tag key={index} size="small">
                                    {tag}
                                </Tag>
                            ))}
                        </Space>
                    )}
                </Space>
            </Space>
        </Card>
    );
};

export default ProductCard;

