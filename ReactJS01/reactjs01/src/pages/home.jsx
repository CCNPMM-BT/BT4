import React, { useContext } from 'react';
import { Card, Row, Col, Typography, Button } from 'antd';
import { UserOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';
import { AuthContext } from '../components/context/auth.context';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const HomePage = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div style={{ padding: '20px' }}>
            <Row justify="center">
                <Col xs={24} md={16} lg={12}>
                    <Card>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <HomeOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                            <Title level={2}>Welcome to Our Application</Title>
                        </div>
                        
                        {auth.isAuthenticated ? (
                            <div>
                                <Card 
                                    title="User Information" 
                                    style={{ marginBottom: '20px' }}
                                    extra={<Button type="primary" onClick={() => navigate('/user')}>View Users</Button>}
                                >
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <UserOutlined style={{ marginRight: '8px' }} />
                                                <Text strong>Name: </Text>
                                                <Text style={{ marginLeft: '8px' }}>{auth.user.name}</Text>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <MailOutlined style={{ marginRight: '8px' }} />
                                                <Text strong>Email: </Text>
                                                <Text style={{ marginLeft: '8px' }}>{auth.user.email}</Text>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                                
                                <div style={{ textAlign: 'center' }}>
                                    <Text type="secondary">
                                        You are successfully logged in. You can now access all features of the application.
                                    </Text>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <Text type="secondary" style={{ fontSize: '16px', marginBottom: '20px', display: 'block' }}>
                                    Please login to access the application features
                                </Text>
                                <Button type="primary" size="large" onClick={() => navigate('/login')}>
                                    Login
                                </Button>
                                <Button size="large" style={{ marginLeft: '10px' }} onClick={() => navigate('/register')}>
                                    Register
                                </Button>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default HomePage;