require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const knex = require('./config/database');  // Import cấu hình knex
const webRouter = require('./routers/api');  // Import router

const app = express();

// Kiểm tra các biến môi trường
const hostname = process.env.HOST_NAME || 'localhost';
const port = process.env.PORT || 8080;
const sessionSecret = process.env.SESSION_SECRET;

// Cấu hình các middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// Cấu hình view engine và layouts
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'view'));

// Cấu hình thư mục tĩnh
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'view')));

// Cấu hình session middleware
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Đặt thành true nếu dùng HTTPS
        httpOnly: true, // Bảo vệ chống lại tấn công XSS
        maxAge: 1000 * 60 * 30 // 30 minutes (milliseconds)
    }
}));

// Sử dụng router đã cấu hình
app.use('/', webRouter);

// Khởi động máy chủ
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/login`);
});
