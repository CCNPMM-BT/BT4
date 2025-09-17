import React, { useState } from 'react';
import { Modal, List, Button, InputNumber, Image, Typography, Space, Divider, Empty, message } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useCart } from '../context/cart.context';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

const CartModal = ({ visible, onClose }) => {
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
        onClose();
        navigate('/checkout');
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
            <List.Item
                key={item.product._id}
                actions={[
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem(item.product._id)}
                        loading={isUpdating}
                    />
                ]}
            >
                <List.Item.Meta
                    avatar={
                        <Image
                            src={item.product.images?.[0] || '/placeholder-image.jpg'}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                        />
                    }
                    title={
                        <Text strong style={{ fontSize: '16px' }}>
                            {item.product.name}
                        </Text>
                    }
                    description={
                        <Space direction="vertical" size={4}>
                            <Text type="secondary">
                                Giá: {formatPrice(item.price)}
                            </Text>
                            <Space>
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
                                    style={{ width: '60px' }}
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
                    }
                />
                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                    <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                        {formatPrice(item.totalPrice)}
                    </Text>
                </div>
            </List.Item>
        );
    };

    return (
        <Modal
            title={
                <Space>
                    <ShoppingCartOutlined />
                    <span>Giỏ hàng của bạn</span>
                </Space>
            }
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="clear" onClick={handleClearCart} disabled={!cart?.items?.length}>
                    Xóa tất cả
                </Button>,
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>,
                <Button
                    key="checkout"
                    type="primary"
                    onClick={handleCheckout}
                    disabled={!cart?.items?.length}
                    icon={<ShoppingCartOutlined />}
                >
                    Thanh toán
                </Button>
            ]}
            width={600}
            style={{ top: 20 }}
        >
            {!cart?.items?.length ? (
                <Empty
                    description="Giỏ hàng trống"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : (
                <>
                    <List
                        dataSource={cart.items}
                        renderItem={renderCartItem}
                        loading={loading}
                        style={{ maxHeight: '400px', overflowY: 'auto' }}
                    />
                    <Divider />
                    <div style={{ textAlign: 'right' }}>
                        <Space direction="vertical" size={8}>
                            <Text>
                                Tổng số sản phẩm: <Text strong>{cart.totalItems}</Text>
                            </Text>
                            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                                Tổng tiền: {formatPrice(cart.totalAmount)}
                            </Title>
                        </Space>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default CartModal;
