# Hướng dẫn cài đặt và cấu hình Elasticsearch

## 1. Cài đặt Elasticsearch

### Trên Windows:
1. Tải Elasticsearch từ: https://www.elastic.co/downloads/elasticsearch
2. Giải nén file zip
3. Chạy Elasticsearch:
```bash
cd elasticsearch-8.x.x/bin
elasticsearch.bat
```

### Trên macOS:
```bash
brew install elasticsearch
brew services start elasticsearch
```

### Trên Linux (Ubuntu/Debian):
```bash
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list
sudo apt-get update
sudo apt-get install elasticsearch
sudo systemctl start elasticsearch
sudo systemctl enable elasticsearch
```

## 2. Cấu hình Elasticsearch

### Kiểm tra Elasticsearch đang chạy:
```bash
curl http://localhost:9200
```

### Cấu hình bảo mật (tùy chọn):
```bash
# Tạo password cho user elastic
bin/elasticsearch-setup-passwords interactive
```

## 3. Cài đặt dependencies cho Node.js

```bash
cd ExpressJS01
npm install
```

## 4. Cấu hình biến môi trường

Tạo file `.env` trong thư mục `ExpressJS01`:
```env
MONGODB_URI=mongodb://localhost:27017/expressjs01
ELASTICSEARCH_URL=localhost:9200
PORT=8080
```

## 5. Sync dữ liệu từ MongoDB sang Elasticsearch

```bash
# Chạy script sync dữ liệu
node src/scripts/syncToElasticsearch.js
```

## 6. Khởi động ứng dụng

```bash
# Khởi động backend
npm run dev

# Khởi động frontend (terminal khác)
cd ReactJS01/reactjs01
npm run dev
```

## 7. Test API

### Test Elasticsearch connection:
```bash
curl http://localhost:8080/v1/api/search/filters
```

### Test search API:
```bash
curl "http://localhost:8080/v1/api/search/products?q=iphone&minPrice=1000000&maxPrice=5000000"
```

## 8. Troubleshooting

### Lỗi kết nối Elasticsearch:
- Kiểm tra Elasticsearch có đang chạy không: `curl http://localhost:9200`
- Kiểm tra port 9200 có bị block không
- Kiểm tra firewall settings

### Lỗi index không tồn tại:
- Chạy lại script sync: `node src/scripts/syncToElasticsearch.js`

### Lỗi mapping:
- Xóa index cũ và tạo lại:
```bash
curl -X DELETE "localhost:9200/products"
```
- Restart ứng dụng để tạo lại index

## 9. Monitoring

### Kiểm tra index:
```bash
curl "localhost:9200/products/_stats"
```

### Kiểm tra mapping:
```bash
curl "localhost:9200/products/_mapping"
```

### Kiểm tra documents:
```bash
curl "localhost:9200/products/_search?pretty"
```
