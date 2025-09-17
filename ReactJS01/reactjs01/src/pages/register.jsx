import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Card,
    Form,
    Input,
    Button,
    Typography,
    Divider,
    message,
    Row,
    Col
} from 'antd';
import {
    LockOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    MailOutlined,
    UserOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { createUserApi } from '../util/apis';

const { Title, Text, Paragraph } = Typography;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { name, email, password } = values;
        setLoading(true);
        try {
            const res = await createUserApi(name, email, password);
            if (res && res.EC === 0) {
                message.success('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
                navigate('/login');
            } else {
                message.error(res?.EM ?? 'Có lỗi xảy ra khi đăng ký');
            }
        } catch (error) {
            console.error('Register error:', error);
            message.error('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}
        >
            <Row justify="center" style={{ width: '100%', maxWidth: '1200px' }}>
                {/* Left Side - Branding */}
                <Col xs={24} lg={12}>
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px 0 0 20px',
                            padding: '60px 40px',
                            height: '600px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            color: 'white'
                        }}
                    >
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '30px',
                                fontSize: '32px',
                                fontWeight: 'bold'
                            }}
                        >
                            Nova
                        </div>

                        <Title level={1} style={{ color: 'white', marginBottom: '16px' }}>
                            Tham gia cùng chúng tôi!
                        </Title>

                        <Paragraph
                            style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '16px',
                                marginBottom: '40px',
                                lineHeight: '1.6'
                            }}
                        >
                            Tạo tài khoản mới để bắt đầu mua sắm và trải nghiệm
                            dịch vụ công nghệ tuyệt vời của Novamall.
                        </Paragraph>
                    </div>
                </Col>

                {/* Right Side - Register Form */}
                <Col xs={24} lg={12}>
                    <Card
                        style={{
                            borderRadius: '0 20px 20px 0',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                            border: 'none',
                            height: '600px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        <div style={{ padding: '40px' }}>
                            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                                <Title level={2} style={{ marginBottom: '8px', color: 'var(--primary-color)' }}>
                                    Đăng ký
                                </Title>
                            </div>

                            <Form
                                form={form}
                                name="register"
                                onFinish={onFinish}
                                layout="vertical"
                                size="large"
                                autoComplete="off"
                            >
                                <Form.Item
                                    name="name"
                                    label="Họ và tên"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập họ và tên!' },
                                        { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                                        placeholder="Nhập họ và tên của bạn"
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email!' },
                                        { type: 'email', message: 'Email không hợp lệ!' }
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                                        placeholder="Nhập email của bạn"
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label="Mật khẩu"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                        placeholder="Nhập mật khẩu của bạn"
                                        style={{ borderRadius: '8px' }}
                                        iconRender={(visible) =>
                                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                        }
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        block
                                        style={{
                                            height: '48px',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                                            border: 'none',
                                            boxShadow: '0 4px 15px rgba(244, 67, 54, 0.4)'
                                        }}
                                    >
                                        Đăng ký
                                    </Button>
                                </Form.Item>
                            </Form>

                            <Divider />

                            <div
                                style={{
                                    textAlign: 'center',
                                    marginTop: '32px',
                                    padding: '20px',
                                    background: '#ffffff',
                                    borderRadius: '8px'
                                }}
                            >
                                <Text type="secondary">
                                    Đã có tài khoản?{' '}
                                    <Link
                                        to="/login"
                                        style={{
                                            color: '#1890ff',
                                            fontWeight: '600',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        Đăng nhập ngay
                                    </Link>
                                </Text>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '5px' }}>
                                <Link
                                    to="/"
                                    style={{
                                        color: '#666',
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <ArrowLeftOutlined />
                                    Về trang chủ
                                </Link>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default RegisterPage;