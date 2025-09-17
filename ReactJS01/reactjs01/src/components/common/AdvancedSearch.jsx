import React, { useState, useCallback, useEffect } from 'react';
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
    Switch,
    Divider,
    Badge,
    Tag
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    ClearOutlined,
    DownOutlined,
    UpOutlined,
    StarOutlined,
    DollarOutlined,
    TagsOutlined,
    FireOutlined,
    CrownOutlined
} from '@ant-design/icons';
import { advancedSearchProductsApi, getSearchSuggestionsApi } from '../../util/apis';

const { Title, Text } = Typography;
const { Option } = Select;

const AdvancedSearch = ({
    onSearchResults,
    onLoading,
    categories = [],
    initialFilters = {}
}) => {
    const [searchParams, setSearchParams] = useState({
        query: initialFilters.query || '',
        category: initialFilters.category || '',
        minPrice: initialFilters.minPrice || 0,
        maxPrice: initialFilters.maxPrice || 100000000,
        minRating: initialFilters.minRating || 0,
        maxRating: initialFilters.maxRating || 5,
        isOnSale: initialFilters.isOnSale || null,
        isFeatured: initialFilters.isFeatured || null,
        sortBy: initialFilters.sortBy || 'createdAt',
        sortOrder: initialFilters.sortOrder || 'desc',
        page: 1,
        limit: 12
    });

    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [popularSuggestions, setPopularSuggestions] = useState([]);

    // Load popular suggestions khi component mount
    useEffect(() => {
        const loadPopularSuggestions = async () => {
            try {
                const response = await getSearchSuggestionsApi('', 10);
                if (response && response.EC === 0) {
                    const popular = response.DT.slice(0, 8).map(item => ({
                        value: item.text,
                        label: (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                padding: '4px 0'
                            }}>
                                <span style={{ 
                                    fontSize: '11px', 
                                    padding: '2px 6px', 
                                    borderRadius: '3px',
                                    background: '#f0f0f0',
                                    color: '#666',
                                    fontWeight: '500',
                                    minWidth: '60px',
                                    textAlign: 'center'
                                }}>
                                    Phổ biến
                                </span>
                                <span style={{ 
                                    flex: 1,
                                    fontSize: '14px',
                                    fontWeight: '400'
                                }}>
                                    {item.text}
                                </span>
                            </div>
                        ),
                        type: 'popular'
                    }));
                    setPopularSuggestions(popular);
                }
            } catch (error) {
                console.error('Error loading popular suggestions:', error);
            }
        };
        loadPopularSuggestions();
    }, []);

    // Debounced search suggestions - hiển thị ngay từ ký tự đầu tiên
    const getSuggestions = useCallback(
        debounce(async (query) => {
            if (query.length < 1) {
                setSuggestions(popularSuggestions);
                return;
            }

            try {
                // Tăng số lượng suggestions và ưu tiên sản phẩm
                const response = await getSearchSuggestionsApi(query, 20);
                if (response && response.EC === 0) {
                    // Sắp xếp để sản phẩm lên đầu
                    const sortedSuggestions = response.DT.sort((a, b) => {
                        if (a.type === 'product' && b.type !== 'product') return -1;
                        if (b.type === 'product' && a.type !== 'product') return 1;
                        return b.score - a.score;
                    });

                    const suggestions = sortedSuggestions.map(item => ({
                        value: item.text,
                        label: (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                padding: '4px 0'
                            }}>
                                <span style={{ 
                                    fontSize: '11px', 
                                    padding: '2px 6px', 
                                    borderRadius: '3px',
                                    background: item.type === 'product' ? '#e6f7ff' : 
                                               item.type === 'category' ? '#f6ffed' : '#fff7e6',
                                    color: item.type === 'product' ? '#1890ff' : 
                                           item.type === 'category' ? '#52c41a' : '#fa8c14',
                                    fontWeight: '500',
                                    minWidth: '60px',
                                    textAlign: 'center'
                                }}>
                                    {item.type === 'product' ? 'Sản phẩm' : 
                                     item.type === 'category' ? 'Danh mục' : 'Tag'}
                                </span>
                                <span style={{ 
                                    flex: 1,
                                    fontSize: '14px',
                                    fontWeight: item.type === 'product' ? '500' : '400'
                                }}>
                                    {item.text}
                                </span>
                                {item.type === 'product' && (
                                    <span style={{
                                        fontSize: '10px',
                                        color: '#8c8c8c',
                                        background: '#f5f5f5',
                                        padding: '1px 4px',
                                        borderRadius: '2px'
                                    }}>
                                        {item.score.toFixed(1)}
                                    </span>
                                )}
                            </div>
                        ),
                        type: item.type,
                        score: item.score
                    }));
                    setSuggestions(suggestions);
                }
            } catch (error) {
                console.error('Error getting suggestions:', error);
            }
        }, 150), // Giảm delay để phản hồi nhanh hơn
        []
    );

    // Handle search input change
    const handleSearchChange = (value) => {
        setSearchParams(prev => ({ ...prev, query: value }));
        
        // Nếu input rỗng, hiển thị popular suggestions
        if (value.length === 0) {
            setSuggestions(popularSuggestions);
        } else {
            // Gọi suggestions ngay lập tức
        getSuggestions(value);
        }
    };

    // Handle search
    const handleSearch = async (resetPage = true) => {
        setLoading(true);
        onLoading(true);

        try {
            const params = {
                ...searchParams,
                page: resetPage ? 1 : searchParams.page
            };

            const response = await advancedSearchProductsApi(params);

            if (response && response.EC === 0) {
                onSearchResults(response.DT);
            } else {
                onSearchResults({
                    products: [],
                    pagination: { currentPage: 1, totalPages: 0, totalProducts: 0 },
                    searchInfo: params
                });
            }
        } catch (error) {
            console.error('Search error:', error);
            onSearchResults({
                products: [],
                pagination: { currentPage: 1, totalPages: 0, totalProducts: 0 },
                searchInfo: searchParams
            });
        } finally {
            setLoading(false);
            onLoading(false);
        }
    };

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setSearchParams(prev => ({ ...prev, [key]: value }));
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSearchParams({
            query: '',
            category: '',
            minPrice: 0,
            maxPrice: 1000000,
            minRating: 0,
            maxRating: 5,
            isOnSale: null,
            isFeatured: null,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            page: 1,
            limit: 12
        });
        setSuggestions([]);
    };

    // Format price for display
    const formatPrice = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    // Format rating for display
    const formatRating = (value) => {
        return `${value} ⭐`;
    };

    // Count active filters
    const getActiveFiltersCount = () => {
        let count = 0;
        if (searchParams.category) count++;
        if (searchParams.minPrice > 0 || searchParams.maxPrice < 1000000) count++;
        if (searchParams.minRating > 0 || searchParams.maxRating < 5) count++;
        if (searchParams.isOnSale !== null) count++;
        if (searchParams.isFeatured !== null) count++;
        return count;
    };

    return (
        <Card
            className="card-fpt"
            style={{
                marginBottom: 'var(--space-lg)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--accent-color)'
            }}
            bodyStyle={{ padding: 'var(--space-lg)' }}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Main Search Bar */}
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={16} md={18}>
                        <AutoComplete
                            options={suggestions.length > 0 ? suggestions : popularSuggestions}
                            value={searchParams.query}
                            onChange={handleSearchChange}
                            placeholder="Gõ để tìm kiếm sản phẩm... (ví dụ: gõ 'i' để xem gợi ý)"
                            style={{ width: '100%' }}
                            size="large"
                            dropdownStyle={{
                                maxHeight: '400px',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-md)',
                                border: '1px solid var(--border-light)'
                            }}
                            dropdownMatchSelectWidth={true}
                            onDropdownVisibleChange={(open) => {
                                // Mở dropdown khi focus và có suggestions
                                if (open && (suggestions.length > 0 || popularSuggestions.length > 0)) {
                                    return true;
                                }
                            }}
                            notFoundContent={
                                searchParams.query.length > 0 ? (
                                    <div style={{ 
                                        padding: 'var(--space-md)', 
                                        textAlign: 'center',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        <SearchOutlined style={{ fontSize: '24px', marginBottom: 'var(--space-sm)' }} />
                                        <div>Không tìm thấy gợi ý cho "{searchParams.query}"</div>
                                    </div>
                                ) : (
                                    <div style={{ 
                                        padding: 'var(--space-md)', 
                                        textAlign: 'center',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        <SearchOutlined style={{ fontSize: '24px', marginBottom: 'var(--space-sm)' }} />
                                        <div>Gõ để tìm kiếm sản phẩm</div>
                                    </div>
                                )
                            }
                            onSelect={(value, option) => {
                                console.log('Selected:', value, option);
                                handleSearchChange(value);
                                // Tự động search khi chọn suggestion
                                setTimeout(() => handleSearch(), 100);
                            }}
                        >
                            <Input
                                prefix={<SearchOutlined style={{ color: 'var(--primary-color)' }} />}
                                onPressEnter={() => handleSearch()}
                                allowClear
                                style={{
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-color)',
                                    transition: 'var(--transition)'
                                }}
                                onFocus={(e) => {
                                    // Hiển thị suggestions ngay khi focus
                                    if (searchParams.query.length > 0) {
                                        getSuggestions(searchParams.query);
                                    } else {
                                        // Hiển thị popular suggestions khi focus vào input rỗng
                                        setSuggestions(popularSuggestions);
                                    }
                                }}
                            />
                        </AutoComplete>
                    </Col>
                    <Col xs={12} sm={4} md={3}>
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            size="large"
                            loading={loading}
                            onClick={() => handleSearch()}
                            className="btn-fpt"
                            style={{
                                width: '100%',
                                borderRadius: 'var(--radius-md)',
                                height: '40px',
                                background: 'var(--primary-color)',
                                border: '2px solid var(--primary-color)',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </Col>
                    <Col xs={12} sm={4} md={3}>
                        <Badge
                            count={getActiveFiltersCount()}
                            size="small"
                            style={{ backgroundColor: 'var(--success-color)' }}
                        >
                            <Button
                                icon={<FilterOutlined />}
                                size="large"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="btn-fpt-outline"
                                style={{
                                    width: '100%',
                                    borderRadius: 'var(--radius-md)',
                                    height: '40px',
                                    border: '2px solid var(--primary-color)',
                                    background: showAdvanced ? 'var(--primary-color)' : 'transparent',
                                    color: showAdvanced ? 'var(--text-white)' : 'var(--primary-color)',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                {showAdvanced ? <UpOutlined /> : <DownOutlined />} Bộ lọc
                            </Button>
                        </Badge>
                    </Col>
                </Row>

                {/* Advanced Filters */}
                {showAdvanced && (
                    <div style={{
                        background: 'var(--background-light)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-lg)',
                        border: '1px solid var(--border-light)'
                    }}>
                        <Row gutter={[16, 16]}>
                            {/* Category Filter */}
                            <Col xs={24} sm={12} md={6}>
                                <div style={{ marginBottom: 'var(--space-md)' }}>
                                    <Text strong style={{ fontSize: '14px', color: 'var(--text-color)' }}>
                                        <TagsOutlined style={{ marginRight: 'var(--space-xs)' }} />
                                        Danh mục
                                    </Text>
                                    <Select
                                        placeholder="Chọn danh mục"
                                        style={{ width: '100%', marginTop: 'var(--space-xs)' }}
                                        value={searchParams.category}
                                        onChange={(value) => handleFilterChange('category', value)}
                                        allowClear
                                        size="large"
                                    >
                                        {categories.map(category => (
                                            <Option key={category._id} value={category._id}>
                                                {category.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            </Col>

                            {/* Price Range */}
                            <Col xs={24} sm={12} md={6}>
                                <div style={{ marginBottom: 'var(--space-md)' }}>
                                    <Text strong style={{ fontSize: '14px', color: 'var(--text-color)' }}>
                                        <DollarOutlined style={{ marginRight: 'var(--space-xs)' }} />
                                        Khoảng giá
                                    </Text>
                                    <div style={{ marginTop: 'var(--space-xs)' }}>
                                        <Slider
                                            range
                                            min={0}
                                            max={100000000}
                                            step={100000}
                                            value={[searchParams.minPrice, searchParams.maxPrice]}
                                            onChange={(value) => {
                                                handleFilterChange('minPrice', value[0]);
                                                handleFilterChange('maxPrice', value[1]);
                                            }}
                                            tooltip={{
                                                formatter: formatPrice
                                            }}
                                        />
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '12px',
                                            marginTop: 'var(--space-xs)',
                                            color: 'var(--text-secondary)'
                                        }}>
                                            <Tag color="green">{formatPrice(searchParams.minPrice)}</Tag>
                                            <Tag color="blue">{formatPrice(searchParams.maxPrice)}</Tag>
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            {/* Rating Range */}
                            <Col xs={24} sm={12} md={6}>
                                <div style={{ marginBottom: 'var(--space-md)' }}>
                                    <Text strong style={{ fontSize: '14px', color: 'var(--text-color)' }}>
                                        <StarOutlined style={{ marginRight: 'var(--space-xs)' }} />
                                        Đánh giá
                                    </Text>
                                    <div style={{ marginTop: 'var(--space-xs)' }}>
                                        <Slider
                                            range
                                            min={0}
                                            max={5}
                                            step={0.1}
                                            value={[searchParams.minRating, searchParams.maxRating]}
                                            onChange={(value) => {
                                                handleFilterChange('minRating', value[0]);
                                                handleFilterChange('maxRating', value[1]);
                                            }}
                                            tooltip={{
                                                formatter: formatRating
                                            }}
                                        />
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '12px',
                                            marginTop: 'var(--space-xs)',
                                            color: 'var(--text-secondary)'
                                        }}>
                                            <Tag color="orange">{formatRating(searchParams.minRating)}</Tag>
                                            <Tag color="gold">{formatRating(searchParams.maxRating)}</Tag>
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            {/* Sort Options */}
                            <Col xs={24} sm={12} md={6}>
                                <div style={{ marginBottom: 'var(--space-md)' }}>
                                    <Text strong style={{ fontSize: '14px', color: 'var(--text-color)' }}>
                                        Sắp xếp
                                    </Text>
                                    <Select
                                        style={{ width: '100%', marginTop: 'var(--space-xs)' }}
                                        value={searchParams.sortBy}
                                        onChange={(value) => handleFilterChange('sortBy', value)}
                                        size="large"
                                    >
                                        <Option value="createdAt">Mới nhất</Option>
                                        <Option value="price">Giá</Option>
                                        <Option value="rating">Đánh giá</Option>
                                        <Option value="name">Tên A-Z</Option>
                                    </Select>
                                </div>
                            </Col>
                        </Row>

                        <Divider style={{ margin: 'var(--space-lg) 0' }} />

                        <Row gutter={[16, 16]}>
                            {/* Special Filters */}
                            <Col xs={24} sm={8} md={6}>
                                <div style={{
                                    background: 'white',
                                    padding: 'var(--space-md)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-light)'
                                }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Text strong style={{ color: 'var(--text-color)' }}>
                                            <FireOutlined style={{ marginRight: 'var(--space-xs)' }} />
                                            Sản phẩm khuyến mãi
                                        </Text>
                                        <Switch
                                            checked={searchParams.isOnSale === true}
                                            onChange={(checked) =>
                                                handleFilterChange('isOnSale', checked ? true : null)
                                            }
                                        />
                                    </Space>
                                </div>
                            </Col>

                            <Col xs={24} sm={8} md={6}>
                                <div style={{
                                    background: 'white',
                                    padding: 'var(--space-md)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-light)'
                                }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Text strong style={{ color: 'var(--text-color)' }}>
                                            <CrownOutlined style={{ marginRight: 'var(--space-xs)' }} />
                                            Sản phẩm nổi bật
                                        </Text>
                                        <Switch
                                            checked={searchParams.isFeatured === true}
                                            onChange={(checked) =>
                                                handleFilterChange('isFeatured', checked ? true : null)
                                            }
                                        />
                                    </Space>
                                </div>
                            </Col>

                            <Col xs={24} sm={8} md={6}>
                                <div style={{ marginBottom: 'var(--space-md)' }}>
                                    <Text strong style={{ fontSize: '14px', color: 'var(--text-color)' }}>
                                        Thứ tự
                                    </Text>
                                    <Select
                                        style={{ width: '100%', marginTop: 'var(--space-xs)' }}
                                        value={searchParams.sortOrder}
                                        onChange={(value) => handleFilterChange('sortOrder', value)}
                                        size="large"
                                    >
                                        <Option value="desc">Giảm dần</Option>
                                        <Option value="asc">Tăng dần</Option>
                                    </Select>
                                </div>
                            </Col>

                            <Col xs={24} sm={24} md={6}>
                                <Button
                                    icon={<ClearOutlined />}
                                    onClick={handleClearFilters}
                                    style={{
                                        width: '100%',
                                        height: '40px',
                                        borderRadius: 'var(--radius-sm)'
                                    }}
                                >
                                    Xóa bộ lọc
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )}
            </Space>
        </Card>
    );
};

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export default AdvancedSearch;
