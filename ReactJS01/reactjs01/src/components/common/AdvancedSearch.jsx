import React, { useState, useEffect, useCallback } from 'react';
import {
    Row,
    Col,
    Input,
    Select,
    Slider,
    Button,
    Card,
    Space,
    Typography,
    AutoComplete,
    Tag,
    Divider,
    Collapse
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    ClearOutlined,
    DownOutlined,
    UpOutlined
} from '@ant-design/icons';
import {
    searchProductsApi,
    getSearchSuggestionsApi,
    getFilterOptionsApi
} from '../../util/apis';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const AdvancedSearch = ({ onSearchResults, onLoading }) => {
    const [searchParams, setSearchParams] = useState({
        q: '',
        category: '',
        minPrice: undefined,
        maxPrice: undefined,
        minDiscount: undefined,
        maxDiscount: undefined,
        minRating: undefined,
        minViews: undefined,
        tags: [],
        sortBy: 'relevance',
        sortOrder: 'desc',
        page: 1,
        limit: 12
    });

    const [suggestions, setSuggestions] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        categories: [],
        priceRange: { min: 0, max: 1000000, avg: 100000 }
    });
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    const fetchFilterOptions = async () => {
        try {
            const response = await getFilterOptionsApi();
            if (response && response.data.success) {
                setFilterOptions(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    const fetchSuggestions = useCallback(async (query) => {
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
    }, []);

    const handleSearch = async (params = searchParams) => {
        setLoading(true);
        onLoading && onLoading(true);

        try {
            const response = await searchProductsApi(params);
            if (response && response.data.success) {
                onSearchResults && onSearchResults(response.data.data);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
            onLoading && onLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        const newParams = { ...searchParams, [field]: value, page: 1 };
        setSearchParams(newParams);

        if (field === 'q') {
            fetchSuggestions(value);
        }
    };

    const handlePriceRangeChange = (value) => {
        setSearchParams(prev => ({
            ...prev,
            minPrice: value[0],
            maxPrice: value[1],
            page: 1
        }));
    };

    const handleDiscountRangeChange = (value) => {
        setSearchParams(prev => ({
            ...prev,
            minDiscount: value[0],
            maxDiscount: value[1],
            page: 1
        }));
    };

    const handleTagChange = (value) => {
        setSearchParams(prev => ({
            ...prev,
            tags: value,
            page: 1
        }));
    };

    const clearFilters = () => {
        setSearchParams({
            q: '',
            category: '',
            minPrice: undefined,
            maxPrice: undefined,
            minDiscount: undefined,
            maxDiscount: undefined,
            minRating: undefined,
            minViews: undefined,
            tags: [],
            sortBy: 'relevance',
            sortOrder: 'desc',
            page: 1,
            limit: 12
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Search Input */}
                <div>
                    <Title level={4}>Tìm kiếm sản phẩm</Title>
                    <AutoComplete
                        options={suggestions}
                        onSearch={fetchSuggestions}
                        onSelect={(value) => handleInputChange('q', value)}
                        style={{ width: '100%' }}
                    >
                        <Search
                            placeholder="Nhập tên sản phẩm, mô tả hoặc từ khóa..."
                            size="large"
                            value={searchParams.q}
                            onChange={(e) => handleInputChange('q', e.target.value)}
                            onSearch={() => handleSearch()}
                            enterButton={<SearchOutlined />}
                            loading={loading}
                        />
                    </AutoComplete>
                </div>

                {/* Filter Toggle */}
                <Button
                    type="dashed"
                    icon={showFilters ? <UpOutlined /> : <DownOutlined />}
                    onClick={() => setShowFilters(!showFilters)}
                    style={{ width: '100%' }}
                >
                    {showFilters ? 'Ẩn bộ lọc' : 'Hiển thị bộ lọc nâng cao'}
                </Button>

                {/* Advanced Filters */}
                {showFilters && (
                    <Collapse defaultActiveKey={['1']}>
                        <Panel header="Bộ lọc nâng cao" key="1">
                            <Row gutter={[16, 16]}>
                                {/* Category Filter */}
                                <Col xs={24} sm={12} md={8}>
                                    <div>
                                        <Text strong>Danh mục</Text>
                                        <Select
                                            placeholder="Chọn danh mục"
                                            style={{ width: '100%', marginTop: 8 }}
                                            value={searchParams.category}
                                            onChange={(value) => handleInputChange('category', value)}
                                            allowClear
                                        >
                                            {filterOptions.categories.map(category => (
                                                <Option key={category.categoryId} value={category.categoryId}>
                                                    {category.categoryId} ({category.count} sản phẩm)
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                </Col>

                                {/* Price Range */}
                                <Col xs={24} sm={12} md={8}>
                                    <div>
                                        <Text strong>Khoảng giá</Text>
                                        <div style={{ marginTop: 8 }}>
                                            <Slider
                                                range
                                                min={filterOptions.priceRange.min}
                                                max={filterOptions.priceRange.max}
                                                step={10000}
                                                value={[searchParams.minPrice || filterOptions.priceRange.min, searchParams.maxPrice || filterOptions.priceRange.max]}
                                                onChange={handlePriceRangeChange}
                                                tooltip={{
                                                    formatter: (value) => formatPrice(value)
                                                }}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                                <Text type="secondary">
                                                    {formatPrice(searchParams.minPrice || filterOptions.priceRange.min)}
                                                </Text>
                                                <Text type="secondary">
                                                    {formatPrice(searchParams.maxPrice || filterOptions.priceRange.max)}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                {/* Discount Range */}
                                <Col xs={24} sm={12} md={8}>
                                    <div>
                                        <Text strong>Khuyến mãi (%)</Text>
                                        <div style={{ marginTop: 8 }}>
                                            <Slider
                                                range
                                                min={0}
                                                max={100}
                                                step={5}
                                                value={[searchParams.minDiscount || 0, searchParams.maxDiscount || 100]}
                                                onChange={handleDiscountRangeChange}
                                                tooltip={{
                                                    formatter: (value) => `${value}%`
                                                }}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                                <Text type="secondary">
                                                    {searchParams.minDiscount || 0}%
                                                </Text>
                                                <Text type="secondary">
                                                    {searchParams.maxDiscount || 100}%
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                {/* Rating Filter */}
                                <Col xs={24} sm={12} md={8}>
                                    <div>
                                        <Text strong>Đánh giá tối thiểu</Text>
                                        <Select
                                            placeholder="Chọn đánh giá"
                                            style={{ width: '100%', marginTop: 8 }}
                                            value={searchParams.minRating}
                                            onChange={(value) => handleInputChange('minRating', value)}
                                            allowClear
                                        >
                                            <Option value={4}>4 sao trở lên</Option>
                                            <Option value={3}>3 sao trở lên</Option>
                                            <Option value={2}>2 sao trở lên</Option>
                                            <Option value={1}>1 sao trở lên</Option>
                                        </Select>
                                    </div>
                                </Col>

                                {/* Views Filter */}
                                <Col xs={24} sm={12} md={8}>
                                    <div>
                                        <Text strong>Lượt xem tối thiểu</Text>
                                        <Select
                                            placeholder="Chọn lượt xem"
                                            style={{ width: '100%', marginTop: 8 }}
                                            value={searchParams.minViews}
                                            onChange={(value) => handleInputChange('minViews', value)}
                                            allowClear
                                        >
                                            <Option value={1000}>1000+ lượt xem</Option>
                                            <Option value={500}>500+ lượt xem</Option>
                                            <Option value={100}>100+ lượt xem</Option>
                                            <Option value={50}>50+ lượt xem</Option>
                                        </Select>
                                    </div>
                                </Col>

                                {/* Sort Options */}
                                <Col xs={24} sm={12} md={8}>
                                    <div>
                                        <Text strong>Sắp xếp theo</Text>
                                        <Select
                                            placeholder="Chọn cách sắp xếp"
                                            style={{ width: '100%', marginTop: 8 }}
                                            value={searchParams.sortBy}
                                            onChange={(value) => handleInputChange('sortBy', value)}
                                        >
                                            <Option value="relevance">Độ liên quan</Option>
                                            <Option value="price_asc">Giá thấp đến cao</Option>
                                            <Option value="price_desc">Giá cao đến thấp</Option>
                                            <Option value="rating">Đánh giá cao</Option>
                                            <Option value="views">Lượt xem nhiều</Option>
                                            <Option value="discount">Khuyến mãi cao</Option>
                                            <Option value="newest">Mới nhất</Option>
                                            <Option value="oldest">Cũ nhất</Option>
                                        </Select>
                                    </div>
                                </Col>
                            </Row>

                            <Divider />

                            {/* Action Buttons */}
                            <Row gutter={16}>
                                <Col>
                                    <Button
                                        type="primary"
                                        icon={<SearchOutlined />}
                                        onClick={() => handleSearch()}
                                        loading={loading}
                                        size="large"
                                    >
                                        Tìm kiếm
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        icon={<ClearOutlined />}
                                        onClick={clearFilters}
                                        size="large"
                                    >
                                        Xóa bộ lọc
                                    </Button>
                                </Col>
                            </Row>
                        </Panel>
                    </Collapse>
                )}
            </Space>
        </Card>
    );
};

export default AdvancedSearch;
