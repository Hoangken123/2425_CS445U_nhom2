const { check, validationResult } = require("express-validator");
const checkAdminExists = (id) => {
    return Admin.findOne({ where: { id: id } }).then(admin => {
      if (!admin) {
        return Promise.reject('Admin không tồn tại');
      }
    });
};
const CreateAdminRequest = [
    check("ten_dang_nhap")
        .not()
        .isEmpty()
        .withMessage("Tên đăng nhập không được để trống")
        .isLength({ min: 6 })
        .withMessage("Tên đăng nhập phải có ít nhất 6 ký tự"),
    check("ten_hien_thi")
        .not()
        .isEmpty()
        .withMessage("Tên hiển thị không được để trống"),
    check("password")
        .not()
        .isEmpty()
        .withMessage("Mật khẩu không được để trống"),
    check("so_dien_thoai")
        .not()
        .isEmpty()
        .withMessage("Số điện thoại không được để trống!")
        .isNumeric()
        .withMessage('Số điện thoại phải là số!')
        .matches(/^\d{10}$/)
        .withMessage('Số điện thoại phải là 10 số!'),
    check("id_cua_hang")
        .not()
        .isEmpty()
        .withMessage("Của hàng không được để trống!"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

const UpdateAdminRequest = [
    check("id")
        .not()
        .custom(checkAdminExists),
    check("ten_dang_nhap")
        .not()
        .isEmpty()
        .withMessage("Tên đăng nhập không được để trống")
        .isLength({ min: 6 })
        .withMessage("Tên đăng nhập phải có ít nhất 6 ký tự"),
    check("ten_hien_thi")
        .not()
        .isEmpty()
        .withMessage("Tên hiển thị không được để trống"),
  
    check("so_dien_thoai")
        .not()
        .isEmpty()
        .withMessage("Số điện thoại không được để trống!")
        .isNumeric()
        .withMessage('Số điện thoại phải là số!')
        .matches(/^\d{10}$/)
        .withMessage('Số điện thoại phải là 10 số!'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
const DeleteAdminRequest = [
    check("id")
        .not()
        .custom(checkAdminExists),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
module.exports = {
    CreateAdminRequest,
    UpdateAdminRequest,
    DeleteAdminRequest
};