# Hệ thống tìm kiếm sản phẩm với Elasticsearch

## Tổng quan

Dự án này đã được tích hợp với Elasticsearch để cung cấp tính năng tìm kiếm sản phẩm nâng cao với:

- **Fuzzy Search**: Tìm kiếm mờ, cho phép tìm kiếm ngay cả khi có lỗi chính tả
- **Multi-field Search**: Tìm kiếm trên nhiều trường (tên, mô tả, danh mục, tags)
- **Advanced Filtering**: Lọc theo nhiều điều kiện (giá, khuyến mãi, đánh giá, lượt xem)
- **Auto-complete**: Gợi ý tìm kiếm tự động
- **Highlighting**: Làm nổi bật từ khóa tìm kiếm trong kết quả

## Cấu trúc API

### 1. Tìm kiếm sản phẩm nâng cao
```
GET /v1/api/search/products
```

**Parameters:**
- `q`: Từ khóa tìm kiếm
- `category`: ID danh mục
- `minPrice`, `maxPrice`: Khoảng giá
- `minDiscount`, `maxDiscount`: Khoảng khuyến mãi (%)
- `minRating`: Đánh giá tối thiểu
- `minViews`: Lượt xem tối thiểu
- `tags`: Danh sách tags (comma-separated)
- `sortBy`: Sắp xếp theo (relevance, price_asc, price_desc, rating, views, discount, newest, oldest)
- `sortOrder`: Thứ tự sắp xếp (asc, desc)
- `page`: Trang hiện tại
- `limit`: Số sản phẩm mỗi trang

**Example:**
```bash
curl "http://localhost:8080/v1/api/search/products?q=iphone&minPrice=1000000&maxPrice=5000000&minRating=4&sortBy=price_asc"
```

### 2. Gợi ý tìm kiếm
```
GET /v1/api/search/suggestions?q=iph
```

### 3. Tìm kiếm phổ biến
```
GET /v1/api/search/popular?limit=10
```

### 4. Tùy chọn bộ lọc
```
GET /v1/api/search/filters
```

## Cấu trúc Frontend

### 1. Trang tìm kiếm nâng cao (`/search`)
- Component `AdvancedSearch` với đầy đủ bộ lọc
- Hiển thị kết quả với highlighting
- Pagination và sorting

### 2. Trang sản phẩm (`/products`)
- Tích hợp tìm kiếm nâng cao
- Chuyển đổi giữa chế độ xem thường và tìm kiếm

### 3. Header với tìm kiếm
- Auto-complete search bar
- Gợi ý tìm kiếm real-time

## Cài đặt và chạy

### 1. Cài đặt Elasticsearch
Xem file `ExpressJS01/scripts/setup-elasticsearch.md` để biết chi tiết.

### 2. Cài đặt dependencies
```bash
# Backend
cd ExpressJS01
npm install

# Frontend
cd ReactJS01/reactjs01
npm install
```

### 3. Cấu hình môi trường
Tạo file `.env` trong `ExpressJS01`:
```env
MONGODB_URI=mongodb://localhost:27017/expressjs01
ELASTICSEARCH_URL=localhost:9200
PORT=8080
```

### 4. Sync dữ liệu
```bash
cd ExpressJS01
node src/scripts/syncToElasticsearch.js
```

### 5. Khởi động ứng dụng
```bash
# Backend
cd ExpressJS01
npm run dev

# Frontend (terminal khác)
cd ReactJS01/reactjs01
npm run dev
```

## Tính năng chính

### 1. Fuzzy Search
- Tìm kiếm với độ chính xác linh hoạt
- Hỗ trợ lỗi chính tả
- Tìm kiếm trên nhiều trường

### 2. Bộ lọc nâng cao
- **Giá**: Slider với khoảng giá động
- **Khuyến mãi**: Lọc theo % giảm giá
- **Đánh giá**: Lọc theo rating tối thiểu
- **Lượt xem**: Lọc theo độ phổ biến
- **Danh mục**: Dropdown với số lượng sản phẩm
- **Tags**: Multi-select tags

### 3. Sắp xếp
- Độ liên quan (relevance)
- Giá (tăng/giảm dần)
- Đánh giá
- Lượt xem
- Khuyến mãi
- Thời gian tạo

### 4. Auto-complete
- Gợi ý real-time
- Completion suggester
- Popular searches

### 5. Highlighting
- Làm nổi bật từ khóa trong kết quả
- HTML highlighting
- Multi-field highlighting

## Cấu trúc Elasticsearch

### Index: `products`
```json
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "keyword": { "type": "keyword" },
          "suggest": { "type": "completion" }
        }
      },
      "description": { "type": "text" },
      "price": { "type": "float" },
      "originalPrice": { "type": "float" },
      "category": { "type": "keyword" },
      "categoryName": { "type": "text" },
      "stock": { "type": "integer" },
      "isActive": { "type": "boolean" },
      "tags": { "type": "keyword" },
      "rating": { "type": "float" },
      "reviewCount": { "type": "integer" },
      "discount": { "type": "float" },
      "views": { "type": "integer" },
      "createdAt": { "type": "date" },
      "updatedAt": { "type": "date" }
    }
  }
}
```

## Monitoring và Debug

### 1. Kiểm tra Elasticsearch
```bash
# Health check
curl http://localhost:9200/_cluster/health

# Index stats
curl "localhost:9200/products/_stats"

# Search test
curl "localhost:9200/products/_search?q=iphone&pretty"
```

### 2. Logs
- Backend logs: Console output
- Elasticsearch logs: `logs/elasticsearch.log`

### 3. Performance
- Monitor query performance
- Check index size
- Optimize mappings if needed

## Troubleshooting

### 1. Elasticsearch không kết nối được
- Kiểm tra Elasticsearch có chạy không
- Kiểm tra port 9200
- Kiểm tra firewall

### 2. Index không tồn tại
- Chạy lại sync script
- Restart ứng dụng

### 3. Kết quả tìm kiếm không chính xác
- Kiểm tra mapping
- Re-index dữ liệu
- Điều chỉnh analyzer

### 4. Performance chậm
- Tối ưu query
- Tăng số shards
- Sử dụng filters thay vì queries

## Mở rộng

### 1. Thêm tính năng
- Faceted search
- Geo-location search
- Machine learning ranking
- Real-time search

### 2. Tối ưu
- Caching
- Index optimization
- Query optimization
- Load balancing

### 3. Monitoring
- Elasticsearch monitoring
- Application metrics
- User behavior analytics
