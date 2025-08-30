import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, notification } from 'antd';
import { createUserApi } from '../util/apis';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        const { name, email, password } = values;
        setLoading(true);
        try {
            const res = await createUserApi(name, email, password);
            if (res && res.EC === 0) {
                notification.success({
                    message: 'CREATE USER',
                    description: 'Success'
                });
                navigate('/login');
            } else {
                notification.error({
                    message: 'CREATE USER',
                    description: res?.EM ?? 'Error'
                });
            }
        } catch (error) {
            console.error('Register error:', error);
            notification.error({
                message: 'CREATE USER',
                description: 'Network error or server error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <legend>Đăng ký</legend>
                    <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <Input />
                        </Form.Item>

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
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link to="/"><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                    <div style={{ marginTop: 5 }}>Bạn đã có tài khoản? <Link to="/login">Login</Link></div>
                </fieldset>
            </Col>
        </Row>
    );
};

export default RegisterPage;