import React from 'react';
import { Result, Button, Typography } from 'antd';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--background-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-lg)'
        }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <Result
                    status="404"
                    title={
                        <Title level={1} style={{ 
                            color: 'var(--text-color)',
                            fontSize: '48px',
                            fontWeight: '700',
                            margin: 0
                        }}>
                            404
                        </Title>
                    }
                    subTitle={
                        <div>
                            <Text style={{ 
                                fontSize: '18px',
                                color: 'var(--text-secondary)',
                                display: 'block',
                                marginBottom: 'var(--space-md)'
                            }}>
                                Trang không tìm thấy
                            </Text>
                            <Text style={{ 
                                fontSize: '14px',
                                color: 'var(--text-light)',
                                display: 'block'
                            }}>
                                Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                            </Text>
                        </div>
                    }
                    extra={[
                        <Button 
                            type="primary" 
                            key="home"
                            icon={<HomeOutlined />}
                            onClick={() => navigate('/')}
                            size="large"
                            style={{
                                height: '44px',
                                padding: '0 var(--space-lg)',
                                marginRight: 'var(--space-md)'
                            }}
                        >
                            Về trang chủ
                        </Button>,
                        <Button 
                            key="back"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(-1)}
                            size="large"
                            style={{
                                height: '44px',
                                padding: '0 var(--space-lg)'
                            }}
                        >
                            Quay lại
                        </Button>
                    ]}
                />
                
                {/* Additional Help */}
                <div style={{
                    marginTop: 'var(--space-2xl)',
                    padding: 'var(--space-lg)',
                    background: 'white',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-light)',
                    maxWidth: '500px',
                    margin: 'var(--space-2xl) auto 0'
                }}>
                    <Text style={{ 
                        fontSize: '16px',
                        color: 'var(--text-color)',
                        fontWeight: '600',
                        display: 'block',
                        marginBottom: 'var(--space-sm)'
                    }}>
                        Có thể bạn đang tìm kiếm:
                    </Text>
                    <div style={{ textAlign: 'left' }}>
                        <Button 
                            type="link" 
                            onClick={() => navigate('/products')}
                            style={{ 
                                padding: 'var(--space-xs) 0',
                                height: 'auto',
                                display: 'block',
                                textAlign: 'left'
                            }}
                        >
                            • Sản phẩm
                        </Button>
                        <Button 
                            type="link" 
                            onClick={() => navigate('/categories')}
                            style={{ 
                                padding: 'var(--space-xs) 0',
                                height: 'auto',
                                display: 'block',
                                textAlign: 'left'
                            }}
                        >
                            • Danh mục
                        </Button>
                        <Button 
                            type="link" 
                            onClick={() => navigate('/login')}
                            style={{ 
                                padding: 'var(--space-xs) 0',
                                height: 'auto',
                                display: 'block',
                                textAlign: 'left'
                            }}
                        >
                            • Đăng nhập
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
