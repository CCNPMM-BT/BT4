import React, { useState } from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    Card,
    Row,
    Col,
    Typography,
    Space,
    Divider,
    Statistic,
    message
} from 'antd';
import {
    ShoppingCartOutlined,
    UserOutlined,
    PhoneOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { createPurchaseApi } from '../../util/apis';

const { TextArea } = Input;
const { Title, Text } = Typography;

const PurchaseModal = ({ 
    visible, 
    onCancel, 
    product, 
    onSuccess 
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        
        try {
            const purchaseData = {
                productId: product._id,
                quantity: values.quantity,
                paymentMethod: values.paymentMethod,
                shippingAddress: {
                    fullName: values.fullName,
                    phone: values.phone,
                    address: values.address,
                    city: values.city,
                    district: values.district,
                    ward: values.ward
                },
                notes: values.notes
            };

            const response = await createPurchaseApi(purchaseData);
            
            if (response && response.EC === 0) {
                message.success('Đơn hàng đã được tạo thành công!');
                form.resetFields();
                onSuccess && onSuccess();
                onCancel();
            } else {
                message.error(response?.EM || 'Có lỗi xảy ra khi tạo đơn hàng');
            }
        } catch (err) {
            console.error('Error creating purchase:', err);
            message.error('Có lỗi xảy ra khi tạo đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = (quantity) => {
        return (product?.price || 0) * quantity;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <Modal
            title={
                <Space>
                    <ShoppingCartOutlined />
                    <span>Đặt hàng</span>
                </Space>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            style={{ top: 20 }}
        >
            <Row gutter={[24, 24]}>
                {/* Product Info */}
                <Col span={24}>
                    <Card size="small" style={{ marginBottom: '16px' }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col span={6}>
                                <img
                                    src={product?.images?.[0] || '/placeholder.jpg'}
                                    alt={product?.name}
                                    style={{
                                        width: '100%',
                                        height: '80px',
                                        objectFit: 'cover',
                                        borderRadius: '8px'
                                    }}
                                />
                            </Col>
                            <Col span={18}>
                                <Title level={5} style={{ margin: 0 }}>
                                    {product?.name}
                                </Title>
                                <Text type="secondary">
                                    Giá: {formatPrice(product?.price || 0)}
                                </Text>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Order Form */}
                <Col span={24}>
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                        initialValues={{ quantity: 1 }}
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Form.Item
                                    name="quantity"
                                    label="Số lượng"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số lượng' },
                                        { type: 'number', min: 1, max: product?.stock || 1, message: 'Số lượng không hợp lệ' }
                                    ]}
                                >
                                    <Input 
                                        type="number" 
                                        min={1} 
                                        max={product?.stock || 1}
                                        addonAfter={`Tối đa: ${product?.stock || 0}`}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="paymentMethod"
                                    label="Phương thức thanh toán"
                                    rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}
                                >
                                    <Input placeholder="Ví dụ: Tiền mặt, Chuyển khoản, Thẻ" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left">
                            <Space>
                                <UserOutlined />
                                <span>Thông tin giao hàng</span>
                            </Space>
                        </Divider>

                        <Form.Item
                            name="fullName"
                            label="Họ và tên người nhận"
                            rules={[
                                { required: true, message: 'Vui lòng nhập họ tên' },
                                { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' }
                            ]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại' },
                                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                            ]}
                        >
                            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                        </Form.Item>

                        <Form.Item
                            name="address"
                            label="Địa chỉ chi tiết"
                            rules={[
                                { required: true, message: 'Vui lòng nhập địa chỉ' },
                                { min: 10, message: 'Địa chỉ phải có ít nhất 10 ký tự' }
                            ]}
                        >
                            <TextArea 
                                rows={2} 
                                placeholder="Số nhà, tên đường, tên khu phố..."
                                prefix={<EnvironmentOutlined />}
                            />
                        </Form.Item>

                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <Form.Item name="city" label="Thành phố/Tỉnh">
                                    <Input placeholder="Hà Nội, TP.HCM..." />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="district" label="Quận/Huyện">
                                    <Input placeholder="Quận 1, Huyện Bình Chánh..." />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="ward" label="Phường/Xã">
                                    <Input placeholder="Phường 1, Xã An Phú..." />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="notes" label="Ghi chú thêm">
                            <TextArea 
                                rows={2} 
                                placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)"
                                maxLength={200}
                                showCount
                            />
                        </Form.Item>

                        {/* Order Summary */}
                        <Card size="small" style={{ background: '#f9f9f9' }}>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Statistic
                                        title="Đơn giá"
                                        value={product?.price || 0}
                                        formatter={(value) => formatPrice(value)}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Form.Item shouldUpdate>
                                        {({ getFieldValue }) => {
                                            const quantity = getFieldValue('quantity') || 1;
                                            const total = calculateTotal(quantity);
                                            return (
                                                <Statistic
                                                    title="Tổng cộng"
                                                    value={total}
                                                    formatter={(value) => formatPrice(value)}
                                                    valueStyle={{ color: '#cf1322', fontSize: '18px', fontWeight: 'bold' }}
                                                />
                                            );
                                        }}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <Divider />

                        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                            <Space>
                                <Button onClick={onCancel} size="large">
                                    Hủy
                                </Button>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={loading}
                                    size="large"
                                    icon={<ShoppingCartOutlined />}
                                >
                                    Đặt hàng ngay
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Modal>
    );
};

export default PurchaseModal;
