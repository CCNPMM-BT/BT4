import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Spin, Alert, Space } from 'antd';
import { getAllCategoriesApi } from '../util/apis';
import CategoryCard from '../components/common/CategoryCard';

const { Title } = Typography;

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllCategoriesApi();
            
            if (response && response.EC === 0) {
                setCategories(response.DT || []);
            } else {
                setError(response?.EM || 'Không thể tải danh sách danh mục');
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Có lỗi xảy ra khi tải danh sách danh mục');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '20px' }}>Đang tải danh sách danh mục...</div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Lỗi tải dữ liệu"
                description={error}
                type="error"
                showIcon
                style={{ margin: '20px' }}
            />
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Title level={2} style={{ textAlign: 'center' }}>
                    Danh mục sản phẩm
                </Title>
                
                <Row gutter={[24, 24]}>
                    {categories.map((category) => (
                        <Col 
                            key={category._id} 
                            xs={24} 
                            sm={12} 
                            md={8} 
                            lg={6} 
                            xl={6}
                        >
                            <CategoryCard category={category} />
                        </Col>
                    ))}
                </Row>
                
                {categories.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Title level={4} type="secondary">
                            Chưa có danh mục nào
                        </Title>
                    </div>
                )}
            </Space>
        </div>
    );
};

export default CategoriesPage;

