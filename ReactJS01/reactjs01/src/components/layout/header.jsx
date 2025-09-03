import React, { useContext } from 'react';
import { HomeOutlined, UserOutlined, SettingOutlined, AppstoreOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context.jsx';

const { Item, SubMenu } = Menu;

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setAuth({
            isAuthenticated: false,
            user: {
                email: "",
                name: ""
            }
        });
        navigate("/login");
    };

    return (
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
            <Item key="home" icon={<HomeOutlined />}>
                <Link to="/">Trang chủ</Link>
            </Item>
            <Item key="categories" icon={<AppstoreOutlined />}>
                <Link to="/categories">Danh mục</Link>
            </Item>
            <Item key="products" icon={<ShoppingOutlined />}>
                <Link to="/products">Sản phẩm</Link>
            </Item>
            {auth.isAuthenticated ? (
                <SubMenu key="subMenu" icon={<SettingOutlined />} title={`Xin chào ${auth.user.name}`}>
                    <Item key="user">
                        <Link to="/user">Quản lý người dùng</Link>
                    </Item>
                    <Item key="logout" onClick={handleLogout}>
                        Đăng xuất
                    </Item>
                </SubMenu>
            ) : (
                <Item key="login" icon={<UserOutlined />}>
                    <Link to="/login">Đăng nhập</Link>
                </Item>
            )}
        </Menu>
    );
};

export default Header;