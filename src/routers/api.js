const express = require('express');
const router = express.Router();
const admin = express.Router();
const multer = require("multer");
const fs = require('fs');
const path = require("path");
const jwt = require('jsonwebtoken');
// Controllers
const { index, data, createAdmin, updateAdmin, deleteAdmin, changePassword, viewlostpassword, handleLostPassword, viewResetPassword, handleResetPassword, indexProfile, updateProfile } = require("../controllers/AdminController");
const { indexLogin, Login, Logout, viewRegister, handleRegister } = require('../controllers/LoginAdminController');
const { indexDanhMuc, getDanhMuc, addDanhMuc, updateDanhMuc, deleteDanhMuc } = require('../controllers/DanhMucController');
const { indexDonVi, getDonVi, addDonVi, deleteDonVi, updateDonVi } = require('../controllers/DonviController');
const { indexsanPham, addsanPham, getsanPham, deletesanPham, updatesanPham } = require('../controllers/SanPhamController');

// Requests (Request Validations)
// const { CreateAdminRequest, UpdateAdminRequest, DeleteAdminRequest } = require("../Request/Admin");
const { validateCreateDanhMuc, validateUpdateDanhMuc, validateDeleteDanhMuc } = require('../Request/DanhMuc');
const { validateCreateDonVi, validateUpdateDonVi } = require('../Request/DonViRequest/DonViRequest');
const { DeleteAdminRequest, CreateAdminRequest, UpdateAdminRequest } = require('../Request/Admin');
const { indexCuaHang, addCuaHang, getCuaHang, deleteCuaHang, updateCuaHang } = require('../controllers/CuaHangController');
const { indexNhanVien, getNhanVien, deleteNhanVien, updateNhanVien } = require('../controllers/NhanVienController');
const { indexSellPage, addToinvoice } = require('../controllers/SellProductController');
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
        const uploadPath = path.resolve(__dirname, '..', 'public', 'uploads', 'products');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); 
        }
        cb(null, uploadPath); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, '_'));
    },
});
const upload = multer({ 
    storage, 
    limits: { fileSize: 10 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (extName && mimeType) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed"));
        }
    }
}).single('hinh_anh');


const isAuthenticated = (req, res, next) => {
    const user = req.session?.user;
    if (!user || user.level !== 1) {
        return res.redirect('/login'); 
    }
    req.session.touch();
    next();
};
const preventLoggedInUserAccess = (req, res, next) => {
    if (req.session?.user) {
        req.session.touch();
        return res.redirect('/login');
    }
    next();
};

// Authentication Routes
router.get('/view-register',viewRegister)
router.post('/handle-register',handleRegister)
router.get('/login', preventLoggedInUserAccess, indexLogin); // Hiển thị trang đăng nhập
router.post('/login', Login); // Xử lý đăng nhập
router.get('/logout', isAuthenticated, Logout); // Xử lý đăng xuất
router.get('/lost-password',viewlostpassword)
router.post('/lost-password',handleLostPassword)
router.get('/reset-password/:token',viewResetPassword)
router.post('/reset-password',handleResetPassword)

// Admin Management Routes
admin.get('/users', isAuthenticated, index); // Trang quản lý admin
admin.get('/users/get-data', isAuthenticated, data); // Lấy danh sách admin
admin.post('/users/create', isAuthenticated, CreateAdminRequest, createAdmin); // Tạo admin mới
admin.post('/users/update', isAuthenticated, UpdateAdminRequest, updateAdmin); // Cập nhật admin
admin.post('/users/delete', isAuthenticated, DeleteAdminRequest, deleteAdmin); // Xóa admin
admin.post('/users/change-password', isAuthenticated, changePassword); // ChangePasswrod admin

//Profile
admin.get('/users/profile/:id', isAuthenticated, indexProfile);
admin.post('/users/profile/update', isAuthenticated, updateProfile);
// Category Management Routes
admin.get('/danh-muc', isAuthenticated, indexDanhMuc); // Trang quản lý danh mục
admin.get('/danh-muc/get-data', isAuthenticated, getDanhMuc); // Lấy danh sách danh mục (phân trang & tìm kiếm)
admin.post('/danh-muc/create', isAuthenticated, validateCreateDanhMuc, addDanhMuc); // Thêm danh mục
admin.post('/danh-muc/update', isAuthenticated, validateUpdateDanhMuc, updateDanhMuc); // Cập nhật danh mục
admin.post('/danh-muc/delete', isAuthenticated, validateDeleteDanhMuc, deleteDanhMuc); // Xóa danh mục

//Unit Management Routes
admin.get('/don-vi', isAuthenticated, indexDonVi); 
admin.get('/don-vi/get-data', isAuthenticated, getDonVi); 
admin.post('/don-vi/create' ,isAuthenticated, validateCreateDonVi, addDonVi); 
admin.delete('/don-vi/delete', isAuthenticated, deleteDonVi); 
admin.put('/don-vi/update', isAuthenticated, validateUpdateDonVi, updateDonVi); 

//Product Management Routes
admin.get('/san-pham', isAuthenticated, indexsanPham); 
admin.get('/san-pham/get-data', isAuthenticated, getsanPham); 
admin.post('/san-pham/create' ,upload,isAuthenticated, addsanPham); 
admin.delete('/san-pham/delete', isAuthenticated, deletesanPham); 
admin.post('/san-pham/update',upload,isAuthenticated, updatesanPham);

// Shop Management Routes
admin.get('/cua-hang', isAuthenticated, indexCuaHang); 
admin.get('/cua-hang/get-data', isAuthenticated, getCuaHang); 
admin.post('/cua-hang/create' ,isAuthenticated, addCuaHang); 
admin.delete('/cua-hang/delete', isAuthenticated, deleteCuaHang); 
admin.put('/cua-hang/update', isAuthenticated, updateCuaHang); 

// Employee Management Routes
admin.get('/nhan-vien', isAuthenticated, indexNhanVien); 
admin.get('/nhan-vien/get-data', isAuthenticated, getNhanVien); 
admin.delete('/nhan-vien/delete', isAuthenticated, deleteNhanVien); 
admin.put('/nhan-vien/update', isAuthenticated, updateNhanVien); 

// Sell 
admin.get('/sell-product',isAuthenticated,indexSellPage)
admin.post('/add-to-invoice',isAuthenticated,addToinvoice)


// Combine admin routes under /admin
router.use('/admin', admin);

module.exports = router;
