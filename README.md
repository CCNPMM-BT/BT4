# 🛍️ E-commerce với Elasticsearch Search

Hệ thống thương mại điện tử với tìm kiếm thông minh sử dụng MongoDB + Elasticsearch.

## 🚀 Quick Start

### 1. Cài đặt MongoDB
```bash
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

### 2. Cài đặt Elasticsearch
```bash
docker run -d --name elasticsearch \
  -p 9200:9200 -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  elasticsearch:8.11.0
```

### 3. Cấu hình .env
Tạo file `.env` trong `ExpressJS01`:
```env
DB_HOST=localhost
DB_PORT=27017
DB_NAME=ecommerce_db
JWT_SECRET=your_jwt_secret_key
PORT=8080
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme
```

### 4. Khởi động Backend
```bash
cd ExpressJS01
npm install
npm run dev
```

### 5. Khởi động Frontend
```bash
cd ReactJS01/reactjs01
npm install
npm run dev
```

## ✨ Tính năng

### 🔍 **Advanced Search**
- **Fuzzy Search**: Tìm kiếm thông minh với khả năng sửa lỗi chính tả
- **Multi-field Search**: Tìm kiếm trên tên, mô tả, danh mục, tags
- **Real-time Suggestions**: Gợi ý tìm kiếm khi gõ

### 🎛️ **Advanced Filters**
- **Price Range**: Lọc theo khoảng giá với slider
- **Rating Filter**: Lọc theo đánh giá
- **Category Filter**: Lọc theo danh mục
- **Special Filters**: isOnSale, isFeatured
- **Sort Options**: Nhiều cách sắp xếp

### 🎨 **Modern UI**
- **Responsive Design**: Tối ưu cho mọi thiết bị
- **Beautiful Interface**: Giao diện hiện đại với gradients
- **Smooth Animations**: Hiệu ứng mượt mà
- **Interactive Elements**: Hover effects, transitions

## 📊 Dữ liệu mẫu

- **4 danh mục**: Điện thoại, Laptop, Phụ kiện, Đồng hồ
- **24 sản phẩm**: Mỗi danh mục 6 sản phẩm
- **Đầy đủ thông tin**: price, rating, tags, isFeatured, isOnSale

## 🛠️ Scripts

```bash
npm run dev          # Start development server
npm start           # Start production server
```

## 🔗 API Endpoints

### Products
```
GET /v1/api/products                    # Lấy tất cả products
GET /v1/api/products/:id                # Lấy product theo ID
GET /v1/api/products/search             # Advanced search
GET /v1/api/products/suggestions        # Search suggestions
```

### Categories
```
GET /v1/api/categories                  # Lấy tất cả categories
GET /v1/api/categories/:id              # Lấy category theo ID
GET /v1/api/categories/:id/products     # Lấy products theo category
```

## 🧪 Test

### Test API
```bash
# Basic search
curl "http://localhost:8080/v1/api/products/search?query=iPhone"

# Advanced search
curl "http://localhost:8080/v1/api/products/search?isOnSale=true&minPrice=1000000"

# Suggestions
curl "http://localhost:8080/v1/api/products/suggestions?q=iph&limit=5"
```

### Test Frontend
Mở: http://localhost:5173/products

## 🐛 Troubleshooting

### MongoDB không kết nối
```bash
docker ps | grep mongodb
docker logs mongodb
```

### Elasticsearch không kết nối
```bash
curl http://localhost:9200
docker logs elasticsearch
```

### Reindex lại data
Data sẽ tự động reindex khi khởi động server

## 📁 Cấu trúc dự án

```
├── ExpressJS01/                 # Backend
│   ├── src/
│   │   ├── config/             # Cấu hình
│   │   ├── controllers/        # API controllers
│   │   ├── models/             # MongoDB models
│   │   ├── services/           # Business logic
│   │   ├── routes/             # API routes
│   │   ├── scripts/            # Utility scripts (nếu cần)
│   └── server.js               # Main server file
│
└── ReactJS01/reactjs01/        # Frontend
    ├── src/
    │   ├── components/         # React components
    │   ├── pages/              # Page components
    │   ├── util/               # Utilities
    │   └── styles/             # CSS styles
    └── package.json
```

## 🎯 Kiến trúc

```
MongoDB → Elasticsearch → API → Frontend
```

1. **MongoDB**: Database chính lưu trữ dữ liệu
2. **Elasticsearch**: Search engine index từ MongoDB
3. **API**: Cung cấp endpoints cho frontend
4. **Frontend**: Giao diện người dùng

## 🚀 Production Ready

- ✅ **Scalable Architecture**: MongoDB + Elasticsearch
- ✅ **Modern UI/UX**: Responsive design với Ant Design
- ✅ **Advanced Search**: Fuzzy search với filters
- ✅ **Performance Optimized**: Lazy loading, pagination
- ✅ **Error Handling**: Graceful error handling
- ✅ **Documentation**: Đầy đủ hướng dẫn

Hệ thống sẵn sàng cho production! 🎉