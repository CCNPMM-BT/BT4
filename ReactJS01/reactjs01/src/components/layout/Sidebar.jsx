import React, { useContext } from 'react';
import { Layout, Menu, Avatar, Typography, Button } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  HeartOutlined,
  EyeOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context.jsx';

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const getKey = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/categories')) return 'categories';
    if (path.startsWith('/products')) return 'products';
    if (path.startsWith('/favorites')) return 'favorites';
    if (path.startsWith('/viewed-products')) return 'viewed-products';
    if (path.startsWith('/user')) return 'user';
    return 'home';
  };

  const items = [
    { key: 'home', icon: <HomeOutlined />, label: <Link to="/">Trang chủ</Link> },
    { key: 'categories', icon: <AppstoreOutlined />, label: <Link to="/categories">Danh mục</Link> },
    { key: 'products', icon: <ShoppingOutlined />, label: <Link to="/products">Sản phẩm</Link> },
  ];

  const userItems = [
    { key: 'favorites', icon: <HeartOutlined />, label: <Link to="/favorites">Yêu thích</Link> },
    { key: 'viewed-products', icon: <EyeOutlined />, label: <Link to="/viewed-products">Đã xem</Link> },
    { key: 'user', icon: <UserOutlined />, label: <Link to="/user">Tài khoản</Link> }
  ];

  return (
    <Sider width={260} style={{
      background: 'var(--accent-color)',
      borderRight: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflow: 'auto'
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))',
          color: 'var(--text-white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700
        }}>N</div>
        <div>
          <Text style={{ fontWeight: 700 }}>NovaMall</Text>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Explore differently</div>
        </div>
      </div>

      {auth.isAuthenticated && (
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar style={{ background: 'var(--primary-color)' }}>{auth.user.name?.charAt(0)?.toUpperCase()}</Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>{auth.user.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{auth.user.email}</div>
          </div>
        </div>
      )}

      <Menu
        mode="inline"
        selectedKeys={[getKey()]}
        items={items}
        style={{
          borderRight: 'none',
          padding: '12px'
        }}
      />

      {auth.isAuthenticated ? (
        <Menu
          mode="inline"
          selectedKeys={[getKey()]}
          items={userItems}
          style={{ borderRight: 'none', padding: '12px' }}
        />
      ) : (
        <div style={{ padding: '16px' }}>
          <Button type="primary" block className="btn-fpt" onClick={() => navigate('/login')}>
            Đăng nhập
          </Button>
        </div>
      )}
    </Sider>
  );
};

export default Sidebar;



