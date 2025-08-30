import React, { useContext } from 'react';
import { HomeOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
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
                <Link to="/">Home Page</Link>
            </Item>
            {auth.isAuthenticated ? (
                <SubMenu key="subMenu" icon={<SettingOutlined />} title={`Welcome ${auth.user.name}`}>
                    <Item key="logout" onClick={handleLogout}>
                        Logout
                    </Item>
                </SubMenu>
            ) : (
                <Item key="login" icon={<UserOutlined />}>
                    <Link to="/login">Login</Link>
                </Item>
            )}
        </Menu>
    );
};

export default Header;