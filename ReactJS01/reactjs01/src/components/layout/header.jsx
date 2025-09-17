import React, { useContext, useState } from 'react';
import {
    HomeOutlined,
    UserOutlined,
    SettingOutlined,
    AppstoreOutlined,
    ShoppingOutlined,
    MenuOutlined,
    CloseOutlined,
    HeartOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { Menu, Button, Drawer, Typography, Avatar, Dropdown } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth.context.jsx';
import CartIcon from '../common/CartIcon';
import CartModal from '../common/CartModal';

const { Item, SubMenu } = Menu;
const { Text } = Typography;

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, setAuth } = useContext(AuthContext);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const [cartModalVisible, setCartModalVisible] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setAuth({
            isAuthenticated: false,
            user: {
                id: "",
                email: "",
                name: "",
                role: ""
            }
        });
        navigate("/login");
        setMobileMenuVisible(false);
    };

    const getCurrentKey = () => {
        const path = location.pathname;
        if (path === '/') return 'home';
        if (path.startsWith('/categories')) return 'categories';
        if (path.startsWith('/products')) return 'products';
        if (path.startsWith('/user')) return 'user';
        return 'home';
    };

    const userMenuItems = [
        {
            key: 'user',
            label: <Link to="/user">Quản lý tài khoản</Link>,
            icon: <UserOutlined />
        },
        {
            key: 'favorites',
            label: <Link to="/favorites">Sản phẩm yêu thích</Link>,
            icon: <HeartOutlined />
        },
        {
            key: 'viewed',
            label: <Link to="/viewed-products">Sản phẩm đã xem</Link>,
            icon: <EyeOutlined />
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <SettingOutlined />,
            onClick: handleLogout
        }
    ];

    const menuItems = [
        {
            key: 'home',
            label: <Link to="/">Trang chủ</Link>,
            icon: <HomeOutlined />
        },
        {
            key: 'categories',
            label: <Link to="/categories">Danh mục</Link>,
            icon: <AppstoreOutlined />
        },
        {
            key: 'products',
            label: <Link to="/products">Sản phẩm</Link>,
            icon: <ShoppingOutlined />
        }
    ];

    const DesktopMenu = () => (
        <div className="container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '80px'
        }}>
            {/* Logo */}
            <Link to="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                textDecoration: 'none',
                color: 'var(--text-white)'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--secondary-color)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: 'var(--text-white)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    T
                </div>
                <div>
                    <Text style={{
                        color: 'var(--text-white)',
                        fontSize: '20px',
                        fontWeight: '700',
                        margin: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        NovaMall
                    </Text>

                </div>
            </Link>

            {/* Navigation */}
            <Menu
                mode="horizontal"
                selectedKeys={[getCurrentKey()]}
                style={{
                    background: 'transparent',
                    border: 'none',
                    flex: 1,
                    justifyContent: 'center'
                }}
                items={menuItems.map(item => ({
                    ...item,
                    style: {
                        color: 'var(--text-white)',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontSize: '14px'
                    }
                }))}
            />

            {/* User Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                {auth.isAuthenticated && (
                    <CartIcon 
                        size="large" 
                        onClick={() => setCartModalVisible(true)}
                        style={{ color: 'var(--text-white)' }}
                    />
                )}
                {auth.isAuthenticated ? (
                    <Dropdown
                        menu={{ items: userMenuItems }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <Button
                            type="text"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-sm)',
                                color: 'var(--text-white)',
                                height: '40px',
                                padding: '0 var(--space-md)',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                        >
                            <Avatar size="small" style={{ background: 'var(--secondary-color)' }}>
                                {auth.user.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <Text style={{
                                color: 'var(--text-white)',
                                margin: 0,
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontSize: '14px'
                            }}>
                                {auth.user.name}
                            </Text>
                        </Button>
                    </Dropdown>
                ) : (
                    <Button
                        type="primary"
                        icon={<UserOutlined />}
                        onClick={() => navigate('/login')}
                        className="btn-fpt"
                        style={{
                            background: 'var(--secondary-color)',
                            border: '2px solid var(--secondary-color)',
                            borderRadius: 'var(--radius-md)',
                            height: '40px',
                            padding: '0 var(--space-md)',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Đăng nhập
                    </Button>
                )}
            </div>
        </div>
    );

    const MobileMenu = () => (
        <div style={{ padding: '16px' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px'
            }}>
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textDecoration: 'none',
                    color: 'var(--text-color)'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--primary-color)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: 'var(--text-white)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        F
                    </div>
                    <div>
                        <Text style={{
                            color: 'var(--text-color)',
                            fontSize: '18px',
                            fontWeight: '700',
                            margin: 0,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            NovaMall
                        </Text>
                    </div>
                </Link>
                <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => setMobileMenuVisible(false)}
                />
            </div>

            <Menu
                mode="vertical"
                selectedKeys={[getCurrentKey()]}
                style={{ border: 'none' }}
                items={menuItems}
                onClick={() => setMobileMenuVisible(false)}
            />

            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--gray-200)' }}>
                {auth.isAuthenticated ? (
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '16px',
                            padding: '12px',
                            background: 'var(--gray-50)',
                            borderRadius: '8px'
                        }}>
                            <Avatar style={{ background: '#1890ff' }}>
                                {auth.user.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <div>
                                <Text strong style={{ display: 'block' }}>{auth.user.name}</Text>
                                <Text type="secondary" style={{ fontSize: '14px' }}>{auth.user.email}</Text>
                            </div>
                        </div>
                        <Menu
                            mode="vertical"
                            style={{ border: 'none' }}
                            items={userMenuItems}
                            onClick={() => setMobileMenuVisible(false)}
                        />
                    </div>
                ) : (
                    <Button
                        type="primary"
                        icon={<UserOutlined />}
                        onClick={() => {
                            navigate('/login');
                            setMobileMenuVisible(false);
                        }}
                        block
                        style={{
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                            border: 'none',
                            height: '44px'
                        }}
                    >
                        Đăng nhập
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <header style={{
            background: 'var(--accent-color)',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '64px'
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-color)' }}>
                    <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))',
                        color: 'var(--text-white)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700
                    }}>N</div>
                    <Text style={{ fontWeight: 700 }}>NovaMall</Text>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {auth.isAuthenticated && (
                        <CartIcon 
                            size="large" 
                            onClick={() => setCartModalVisible(true)}
                        />
                    )}
                    {auth.isAuthenticated ? (
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button type="text" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Avatar size="small" style={{ background: 'var(--primary-color)' }}>
                                    {auth.user.name?.charAt(0)?.toUpperCase()}
                                </Avatar>
                                <Text>{auth.user.name}</Text>
                            </Button>
                        </Dropdown>
                    ) : (
                        <Button type="primary" className="btn-fpt" onClick={() => navigate('/login')}>
                            Đăng nhập
                        </Button>
                    )}
                    <Button type="text" icon={<MenuOutlined />} onClick={() => setMobileMenuVisible(true)} />
                </div>
            </div>

            <Drawer
                title={<div style={{ fontWeight: 700 }}>Menu</div>}
                placement="right"
                onClose={() => setMobileMenuVisible(false)}
                open={mobileMenuVisible}
                width={280}
                styles={{ body: { padding: 0 } }}
            >
                <MobileMenu />
            </Drawer>

            <CartModal 
                visible={cartModalVisible}
                onClose={() => setCartModalVisible(false)}
            />
        </header>
    );
};

export default Header;