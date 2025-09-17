# React Frontend Application

Ứng dụng React frontend được thiết kế để tương tác với backend Express.js.

## Tính năng

- **Authentication**: Đăng ký, đăng nhập, đăng xuất
- **User Management**: Xem danh sách người dùng
- **Protected Routes**: Bảo vệ các trang cần authentication
- **Responsive Design**: Sử dụng Ant Design cho UI

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Cấu hình backend URL:
   - Mở file `src/config/config.js`
   - Thay đổi `BACKEND_URL` thành URL backend của bạn
   - Mặc định: `http://localhost:8080`

## Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## Cấu trúc thư mục

```
src/
├── components/
│   ├── common/          # Components dùng chung
│   ├── context/         # React Context
│   └── layout/          # Layout components
├── config/              # Cấu hình ứng dụng
├── pages/               # Các trang của ứng dụng
├── services/            # Business logic
├── styles/              # CSS styles
└── util/                # Utilities và API calls
```

## API Endpoints

- `POST /v1/api/register` - Đăng ký người dùng
- `POST /v1/api/login` - Đăng nhập
- `GET /v1/api/user` - Lấy thông tin người dùng hiện tại
- `GET /v1/api/account` - Lấy thông tin tài khoản

## Authentication Flow

1. User đăng ký tài khoản
2. User đăng nhập và nhận access token
3. Token được lưu vào localStorage
4. Token được gửi trong header Authorization cho các API calls
5. Nếu token hết hạn, user được redirect về trang login

## Protected Routes

- `/user` - Chỉ user đã đăng nhập mới truy cập được
- Các trang khác có thể truy cập tự do

## Dependencies chính

- React 19
- React Router DOM
- Ant Design
- Axios
- Vite
