import React, { useContext, useState } from 'react';
import { HomeOutlined, UserOutlined, SettingOutlined, AppstoreOutlined, ShoppingOutlined, SearchOutlined } from '@ant-design/icons';
import { Menu, Input, AutoComplete } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context.jsx';
import { getSearchSuggestionsApi } from '../../util/apis';

const { Item, SubMenu } = Menu;

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const [searchValue, setSearchValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

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

    const handleSearch = (value) => {
        if (value.trim()) {
            navigate(`/search?q=${encodeURIComponent(value.trim())}`);
        }
    };

    const fetchSuggestions = async (query) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await getSearchSuggestionsApi(query);
            if (response && response.data.success) {
                setSuggestions(response.data.data.map(item => ({
                    value: item.text,
                    label: item.text
                })));
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
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
            
            {/* Search Bar */}
            <Item key="search" style={{ flex: 1, maxWidth: 400 }}>
                <AutoComplete
                    options={suggestions}
                    onSearch={fetchSuggestions}
                    onSelect={(value) => handleSearch(value)}
                    style={{ width: '100%' }}
                >
                    <Input.Search
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onSearch={handleSearch}
                        enterButton={<SearchOutlined />}
                        size="small"
                    />
                </AutoComplete>
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