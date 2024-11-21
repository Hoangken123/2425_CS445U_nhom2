const express = require('express');
const router = express.Router();
const admin = express.Router();
const multer = require("multer");
const fs = require('fs');
const path = require("path");

// Controllers
const { index, data, createAdmin, updateAdmin, deleteAdmin } = require("../controllers/AdminController");
const { indexLogin, Login, Logout } = require('../controllers/LoginAdminController');
const { indexDanhMuc, getDanhMuc, addDanhMuc, updateDanhMuc, deleteDanhMuc } = require('../controllers/DanhMucController');
const { indexDonVi, getDonVi, addDonVi, deleteDonVi, updateDonVi } = require('../controllers/DonviController');
const { indexsanPham, addsanPham, getsanPham } = require('../controllers/SanPhamController');

// Requests (Request Validations)
const { CreateAdminRequest, UpdateAdminRequest, DeleteAdminRequest } = require("../Request/Admin");
const { validateCreateDanhMuc, validateUpdateDanhMuc, validateDeleteDanhMuc } = require('../Request/DanhMuc');
const { validateCreateDonVi, validateUpdateDonVi } = require('../Request/DonViRequest/DonViRequest');
// Middlewares
// const isAuthenticated = (req, res, next) => {
//     const user = req.session?.user;
//     if (!user) {
//         return res.redirect('/login');
//     }
//     next();
// };

// HANDLE UPLOAD IMAGE
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'public', 'uploads', 'products');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); 
        }
        cb(null, uploadPath); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });
const uploadMiddleware = upload.single('hinh_anh');


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


admin.get('/don-vi', isAuthenticated, indexDonVi); 
admin.get('/don-vi/get-data', isAuthenticated, getDonVi); 
admin.post('/don-vi/create' ,isAuthenticated, validateCreateDonVi, addDonVi); 
admin.delete('/don-vi/delete', isAuthenticated, deleteDonVi); 
admin.put('/don-vi/update', isAuthenticated, validateUpdateDonVi, updateDonVi); 


admin.get('/san-pham', isAuthenticated, indexsanPham); 
admin.get('/san-pham/get-data', isAuthenticated, getsanPham); 
admin.post('/san-pham/create' ,uploadMiddleware,isAuthenticated, addsanPham); 
// admin.delete('/san-pham/delete', isAuthenticated, deletesanPham); 
// admin.put('/san-pham/update', isAuthenticated, validateUpdatesanPham, updatesanPham); 

// Combine admin routes under /admin
router.use('/admin', admin);

module.exports = router;
