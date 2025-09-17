import React, { useState } from 'react';
import { Row, Col, Card, List, Button, InputNumber, Image, Typography, Space, Divider, Empty, message, Spin } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, MinusOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useCart } from '../components/context/cart.context';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

const CartPage = () => {
    const { cart, loading, updateCartItem, removeFromCart, clearCart } = useCart();
    const [updatingItems, setUpdatingItems] = useState(new Set());
    const navigate = useNavigate();

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setUpdatingItems(prev => new Set(prev).add(productId));
        try {
            await updateCartItem(productId, newQuantity);
            message.success('Cập nhật giỏ hàng thành công');
        } catch (error) {
            message.error(error.message || 'Có lỗi xảy ra');
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await removeFromCart(productId);
            message.success('Đã xóa sản phẩm khỏi giỏ hàng');
        } catch (error) {
            message.error(error.message || 'Có lỗi xảy ra');
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCart();
            message.success('Đã xóa toàn bộ giỏ hàng');
        } catch (error) {
            message.error(error.message || 'Có lỗi xảy ra');
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleContinueShopping = () => {
        navigate('/products');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const renderCartItem = (item) => {
        const isUpdating = updatingItems.has(item.product._id);
        
        return (
            <Card
                key={item.product._id}
                style={{ marginBottom: '16px' }}
                bodyStyle={{ padding: '16px' }}
            >
                <Row gutter={16} align="middle">
                    <Col xs={24} sm={6} md={4}>
                        <Image
                            src={item.product.images?.[0] || '/placeholder-image.jpg'}
                            alt={item.product.name}
                            width={100}
                            height={100}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                        />
                    </Col>
                    <Col xs={24} sm={12} md={14}>
                        <Space direction="vertical" size={8} style={{ width: '100%' }}>
                            <Title level={4} style={{ margin: 0 }}>
                                {item.product.name}
                            </Title>
                            <Text type="secondary">
                                Giá: {formatPrice(item.price)}
                            </Text>
                            <Space wrap>
                                <Text>Số lượng:</Text>
                                <Button
                                    size="small"
                                    icon={<MinusOutlined />}
                                    onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                    disabled={item.quantity <= 1 || isUpdating}
                                />
                                <InputNumber
                                    size="small"
                                    min={1}
                                    max={99}
                                    value={item.quantity}
                                    onChange={(value) => handleQuantityChange(item.product._id, value)}
                                    style={{ width: '80px' }}
                                    disabled={isUpdating}
                                />
                                <Button
                                    size="small"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                    disabled={isUpdating}
                                />
                            </Space>
                        </Space>
                    </Col>
                    <Col xs={24} sm={6} md={6}>
                        <Space direction="vertical" size={8} style={{ width: '100%', textAlign: 'right' }}>
                            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                                {formatPrice(item.totalPrice)}
                            </Title>
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemoveItem(item.product._id)}
                                loading={isUpdating}
                            >
                                Xóa
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>
        );
    };

    if (loading && !cart) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>Đang tải giỏ hàng...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Row gutter={24}>
                <Col xs={24} lg={16}>
                    <Card
                        title={
                            <Space>
                                <ShoppingCartOutlined />
                                <span>Giỏ hàng của bạn</span>
                            </Space>
                        }
                        extra={
                            cart?.items?.length > 0 && (
                                <Button danger onClick={handleClearCart}>
                                    Xóa tất cả
                                </Button>
                            )
                        }
                    >
                        {!cart?.items?.length ? (
                            <Empty
                                description="Giỏ hàng trống"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            >
                                <Button type="primary" onClick={handleContinueShopping}>
                                    Tiếp tục mua sắm
                                </Button>
                            </Empty>
                        ) : (
                            <List
                                dataSource={cart.items}
                                renderItem={renderCartItem}
                                loading={loading}
                            />
                        )}
                    </Card>
                </Col>
                
                {cart?.items?.length > 0 && (
                    <Col xs={24} lg={8}>
                        <Card title="Tóm tắt đơn hàng">
                            <Space direction="vertical" size={16} style={{ width: '100%' }}>
                                <div>
                                    <Text>Tổng số sản phẩm: </Text>
                                    <Text strong>{cart.totalItems}</Text>
                                </div>
                                <Divider />
                                <div>
                                    <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                                        Tổng tiền: {formatPrice(cart.totalAmount)}
                                    </Title>
                                </div>
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    onClick={handleCheckout}
                                    icon={<ShoppingCartOutlined />}
                                >
                                    Thanh toán
                                </Button>
                                <Button
                                    size="large"
                                    block
                                    onClick={handleContinueShopping}
                                    icon={<ArrowLeftOutlined />}
                                >
                                    Tiếp tục mua sắm
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default CartPage;
