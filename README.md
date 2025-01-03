﻿# 2425_CS445U_nhom2
# Hướng dẫn cài đặt và khởi chạy dự án 2425_CS445U_nhom2

## 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản >= 14.0
- **npm**: Đi kèm với Node.js
- **MySQL**: Để lưu trữ dữ liệu
- **Git**: Để tải mã nguồn từ GitHub 

## 2. Cài đặt
1. **Clone dự án từ GitHub** (tuỳ chọn, nếu chưa có mã nguồn):
    ```bash
    git clone https://github.com/Hoangken123/2425_CS445U_nhom2.git
    cd 2425_CS445U_nhom2
    ```

2. **Cài đặt các phụ thuộc Node.js**:
    ```bash
    npm install
    ```

3. **Tạo tệp cấu hình .env**:
    Tạo tệp `.env` trong thư mục gốc dự án và thêm các thông tin cần thiết:
    ```env
    # Server configuration
    HOST_NAME=localhost
    PORT=3000

    # Database configuration
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=quanlynhathuoc

    # Session secret for secure session handling
    SESSION_SECRET=1d588e0037a4509dca9176f1c4c818cb5c15d0ed2a12b7d314088eaf9c034c7e

    # Email Configuration for Nodemailer
    EMAIL_USER="hpvy.work@gmail.com"    # Địa chỉ email của bạn
    EMAIL_PASSWORD="Hoang1357@"   # Mật khẩu ứng dụng (App Password) bạn vừa tạo
    BASE_URL=http://localhost:3000 # Thay đổi nếu dùng server khác
    ```

4. **Tạo cơ sở dữ liệu và chạy migration**:
    - Đảm bảo rằng cơ sở dữ liệu đã tạo trong MySQL.
    - Chạy migration:
      ```bash
      npm run migrate
      ```

## 3. Khởi chạy ứng dụng
1. Chạy server:
    ```bash
    npm start
    ```

2. Truy cập ứng dụng tại: [http://localhost:3000](http://localhost:3000)




