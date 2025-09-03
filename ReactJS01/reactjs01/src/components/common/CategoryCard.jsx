import React from 'react';
import { Card, Image, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();

    const handleCategoryClick = () => {
        navigate(`/category/${category._id}`);
    };

    return (
        <Card
            hoverable
            cover={
                <Image
                    alt={category.name}
                    src={category.image || 'https://via.placeholder.com/300x200?text=Category'}
                    style={{ height: 150, objectFit: 'cover' }}
                    preview={false}
                />
            }
            onClick={handleCategoryClick}
            style={{ cursor: 'pointer' }}
        >
            <Card.Meta
                title={
                    <Title level={4} style={{ textAlign: 'center', margin: 0 }}>
                        {category.name}
                    </Title>
                }
                description={
                    <Text 
                        type="secondary" 
                        style={{ 
                            textAlign: 'center', 
                            display: 'block',
                            marginTop: '8px'
                        }}
                    >
                        {category.description}
                    </Text>
                }
            />
        </Card>
    );
};

export default CategoryCard;

