const express = require('express');
const router = express.Router();
const admin = express.Router();

// Controllers
const { index, data, createAdmin, updateAdmin, deleteAdmin } = require("../controllers/AdminController");
const { indexLogin, Login, Logout } = require('../controllers/LoginAdminController');
const { indexDanhMuc, getDanhMuc, addDanhMuc, updateDanhMuc, deleteDanhMuc } = require('../controllers/DanhMucController');

// Requests (Request Validations)
const { CreateAdminRequest, UpdateAdminRequest, DeleteAdminRequest } = require("../Request/Admin");
const { validateCreateDanhMuc, validateUpdateDanhMuc, validateDeleteDanhMuc } = require('../Request/DanhMuc');

// Middlewares
// const isAuthenticated = (req, res, next) => {
//     const user = req.session?.user;
//     if (!user) {
//         return res.redirect('/login');
//     }
//     next();
// };
const isAuthenticated = (req, res, next) => {
    // Bỏ qua kiểm tra đăng nhập
    console.log("Bỏ qua xác thực, tiếp tục chạy vào menu.");
    next();
};
const preventLoggedInUserAccess = (req, res, next) => {
    if (req.session?.user) {
        return res.redirect('/admin');
    }
    next();
};

// Authentication Routes
router.get('/login', preventLoggedInUserAccess, indexLogin); // Hiển thị trang đăng nhập
router.post('/login', Login); // Xử lý đăng nhập
router.get('/logout', isAuthenticated, Logout); // Xử lý đăng xuất

// Admin Management Routes
admin.get('/', isAuthenticated, index); // Trang quản lý admin
admin.get('/get-data', isAuthenticated, data); // Lấy danh sách admin
admin.post('/create', isAuthenticated, CreateAdminRequest, createAdmin); // Tạo admin mới
admin.post('/update', isAuthenticated, UpdateAdminRequest, updateAdmin); // Cập nhật admin
admin.post('/delete', isAuthenticated, DeleteAdminRequest, deleteAdmin); // Xóa admin

// Category Management Routes
admin.get('/danh-muc', isAuthenticated, indexDanhMuc); // Trang quản lý danh mục
admin.get('/danh-muc/get-data', isAuthenticated, getDanhMuc); // Lấy danh sách danh mục (phân trang & tìm kiếm)
admin.post('/danh-muc/create', isAuthenticated, validateCreateDanhMuc, addDanhMuc); // Thêm danh mục
admin.post('/danh-muc/update', isAuthenticated, validateUpdateDanhMuc, updateDanhMuc); // Cập nhật danh mục
admin.post('/danh-muc/delete', isAuthenticated, validateDeleteDanhMuc, deleteDanhMuc); // Xóa danh mục

// Combine admin routes under /admin
router.use('/admin', admin);

module.exports = router;
