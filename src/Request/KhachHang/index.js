const { check, validationResult } = require("express-validator");


const validateCreateKhachHang = [
    check("ten_khach_hang")
        .notEmpty()
        .withMessage("Tên khách hàng không được để trống"),
        
    check("so_dien_thoai")
        .notEmpty()
        .withMessage("Số điện thoại không được để trống")
        .isLength({ min: 10, max: 10 })
        .withMessage("Số điện thoại phải có 10 chữ số")
        .isNumeric()
        .withMessage("Số điện thoại chỉ chứa các chữ số"),

    check("email")
        .notEmpty()
        .withMessage("Email không được để trống")
        .isEmail()
        .withMessage("Email không hợp lệ"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }
        next();
    },
];

// Kiểm tra dữ liệu cập nhật khách hàng
const validateUpdatekhachHang = [
    check("id")
        .notEmpty()
        .withMessage("ID danh mục không được để trống")
        .isNumeric()
        .withMessage("ID danh mục phải là số"),
    check("ten_khach_hang")
        .notEmpty()
        .withMessage("Tên khách hàng không được để trống"),
        
    check("so_dien_thoai")
        .notEmpty()
        .withMessage("Số điện thoại không được để trống")
        .isLength({ min: 10, max: 10 })
        .withMessage("Số điện thoại phải có 10 chữ số")
        .isNumeric()
        .withMessage("Số điện thoại chỉ chứa các chữ số"),
    check("email")
        .notEmpty()
        .withMessage("Email không được để trống")
        .isEmail()
        .withMessage("Email không hợp lệ"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }
        next();
    },
];

// Kiểm tra dữ liệu xóa khách hàng
const validateDeleteKhachHang = [
    check("id")
        .notEmpty()
        .withMessage("ID khách hàng không được để trống")
        .isNumeric()
        .withMessage("ID khách hàng phải là số"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }
        next();
    },
];

module.exports = {
    validateCreateKhachHang,
    validateUpdatekhachHang,
    validateDeleteKhachHang,
};
