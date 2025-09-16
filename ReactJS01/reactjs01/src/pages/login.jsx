import React, { useContext, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { loginApi } from '../util/apis';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { AuthContext } from '../components/context/auth.context';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuth } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await loginApi(values.email, values.password);
            console.log('Login response:', res);
            if (res && res.EC === 0) {
                console.log('Saving token to localStorage:', res.access_token);
                localStorage.setItem('access_token', res.access_token);
                console.log('Token saved, verifying:', localStorage.getItem('access_token'));
                setAuth({
                    isAuthenticated: true,
                    user: {
                        id: res.user?.id || res.id,
                        email: res.user?.email || res.email,
                        name: res.user?.name || res.name
                    }
                });
                notification.success({
                    message: 'LOGIN USER',
                    description: 'Success'
                });
                // Redirect to the page they were trying to access, or home
                const from = location.state?.from?.pathname || '/';
                navigate(from, { replace: true });
            } else {
                notification.error({
                    message: 'LOGIN USER',
                    description: res?.EM ?? 'Error'
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            notification.error({
                message: 'LOGIN USER',
                description: 'Network error or server error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form name="basic" onFinish={onFinish} autoComplete="off" layout="vertical">
            <Row justify={"center"} style={{ marginTop: "30px" }}>
                <Col xs={24} md={16} lg={8}>
                    <fieldset style={{
                        padding: "15px",
                        margin: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "5px"
                    }}>
                        <legend>Đăng nhập</legend>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Login
                            </Button>
                        </Form.Item>

                        <Divider orientation='center'>Or</Divider>
                        <div style={{ textAlign: "center" }}>
                            <span>Bạn chưa có tài khoản? <Link to="/register">Register</Link></span>
                        </div>
                    </fieldset>
                </Col>
            </Row>
        </Form>
    );
};

export default LoginPage;