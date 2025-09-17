import React from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge, Button } from 'antd';
import { useCart } from '../context/cart.context';
import { useNavigate } from 'react-router-dom';

const CartIcon = ({ size = 'large', showText = false, onClick }) => {
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate('/cart');
        }
    };

    return (
        <Badge count={cartCount} size="small" offset={[-5, 5]}>
            <Button
                type="text"
                icon={<ShoppingCartOutlined style={{ fontSize: size === 'large' ? '20px' : '16px' }} />}
                onClick={handleClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#1890ff',
                    border: 'none',
                    background: 'transparent'
                }}
            >
                {showText && (
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                        Giỏ hàng
                    </span>
                )}
            </Button>
        </Badge>
    );
};

export default CartIcon;
