import React from 'react';
import { Button, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const HeroSlider = () => {
    const navigate = useNavigate();

    return (
        <div style={{ 
            marginBottom: 'var(--space-2xl)',
            width: '100%',
            height: '60vh',
            backgroundImage: 'url(https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1900&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Dark Overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)',
                    zIndex: 1
                }}
            />
            
            {/* Content */}
            <div style={{ 
                position: 'relative', 
                zIndex: 2, 
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'white'
            }}>
                <div style={{ maxWidth: '800px', padding: '0 var(--space-lg)' }}>
                    <Title
                        level={1}
                        style={{
                            color: 'var(--text-white)',
                            fontSize: '64px',
                            fontWeight: '800',
                            margin: '0 0 var(--space-lg) 0',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                            lineHeight: '1.1',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                        }}
                    >
                        NovaMall
                    </Title>
                    
                    <Text
                        style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '24px',
                            lineHeight: '1.6',
                            display: 'block',
                            marginBottom: 'var(--space-xl)',
                            fontWeight: '400',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                        }}
                    >
                        Khám phá công nghệ hiện đại với mức giá hợp lý
                    </Text>
                    
                    <Text
                        style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '18px',
                            lineHeight: '1.5',
                            display: 'block',
                            marginBottom: 'var(--space-2xl)',
                            fontWeight: '300',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                        }}
                    >
                        Từ smartphone đến laptop, smartwatch đến tablet - tất cả đều có tại NovaMall
                    </Text>

                    <Button
                        type="primary"
                        size="large"
                        onClick={() => navigate('/products')}
                        className="btn-fpt"
                        style={{
                            height: '60px',
                            padding: '0 var(--space-2xl)',
                            fontSize: '18px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            background: 'var(--primary-color)',
                            border: '2px solid var(--primary-color)',
                            color: 'var(--text-white)',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                        icon={<ArrowRightOutlined />}
                    >
                        Khám phá ngay
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeroSlider;
