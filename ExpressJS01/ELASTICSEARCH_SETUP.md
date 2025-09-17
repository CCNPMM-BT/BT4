# Elasticsearch Setup Guide

## Cài đặt Elasticsearch

### Option 1: Sử dụng Docker (Khuyến nghị)
```bash
# Chạy Elasticsearch với Docker
docker run -d --name elasticsearch \
  -p 9200:9200 -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  elasticsearch:8.11.0
```

### Option 2: Cài đặt trực tiếp
1. Tải Elasticsearch từ: https://www.elastic.co/downloads/elasticsearch
2. Giải nén và chạy: `./bin/elasticsearch`
3. Mặc định chạy trên port 9200

## Cấu hình Environment Variables

Thêm vào file `.env`:
```env
# Elasticsearch Configuration
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme
```

## Reindex Products

Sau khi cài đặt Elasticsearch, chạy lệnh để index tất cả products:

```bash
npm run reindex
```

## API Endpoints

### Advanced Search
```
GET /v1/api/products/search
```

Parameters:
- `query`: Từ khóa tìm kiếm (fuzzy search)
- `category`: ID danh mục
- `minPrice`, `maxPrice`: Khoảng giá
- `minRating`, `maxRating`: Khoảng đánh giá
- `isOnSale`: true/false/null - chỉ sản phẩm khuyến mãi
- `isFeatured`: true/false/null - chỉ sản phẩm nổi bật
- `sortBy`: createdAt, price, rating, viewCount, name
- `sortOrder`: asc, desc
- `page`: Số trang
- `limit`: Số sản phẩm mỗi trang

### Search Suggestions
```
GET /v1/api/products/suggestions?q=query&limit=10
```

## Features

### Fuzzy Search
- Tìm kiếm thông minh với khả năng sửa lỗi chính tả
- Tìm kiếm trên nhiều trường: name, description, category, tags
- Highlight kết quả tìm kiếm

### Advanced Filtering
- Lọc theo danh mục
- Lọc theo khoảng giá
- Lọc theo đánh giá
- Lọc sản phẩm khuyến mãi
- Lọc sản phẩm nổi bật

### Sorting Options
- Mới nhất
- Giá (tăng/giảm dần)
- Đánh giá
- Lượt xem
- Tên A-Z

### Auto-complete
- Gợi ý tìm kiếm real-time
- Debounced để tối ưu performance

## Troubleshooting

### Elasticsearch không kết nối được
1. Kiểm tra Elasticsearch có đang chạy không: `curl http://localhost:9200`
2. Kiểm tra URL trong .env file
3. Kiểm tra firewall/port 9200

### Không có kết quả tìm kiếm
1. Chạy `npm run reindex` để index lại products
2. Kiểm tra logs trong console
3. Đảm bảo có products trong database

### Performance Issues
1. Tăng heap size cho Elasticsearch: `-Xms2g -Xmx2g`
2. Sử dụng SSD cho storage
3. Tối ưu mapping và settings

