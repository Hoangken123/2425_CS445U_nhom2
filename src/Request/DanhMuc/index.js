const { check, validationResult } = require("express-validator");

// const checkDanhMucExists = (id) => {
//     return DanhMuc.findOne({ where: { id: id } }).then(DanhMuc => {
//       if (!DanhMuc) {
//         return Promise.reject('DanhMuc không tồn tại');
//       }
//     });
// };
// Kiểm tra dữ liệu thêm danh mục
const validateCreateDanhMuc = [
    check("ten")
        .notEmpty()
        .withMessage("Tên danh mục không được để trống")
        .isLength({ min: 2 })
        .withMessage("Tên danh mục phải có ít nhất 2 ký tự"),
    check("mo_ta")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Mô tả danh mục không được vượt quá 500 ký tự"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }
        next();
    },
];

// Kiểm tra dữ liệu cập nhật danh mục
const validateUpdateDanhMuc = [
    check("id")
        .notEmpty()
        .withMessage("ID danh mục không được để trống")
        .isNumeric()
        .withMessage("ID danh mục phải là số"),
    check("ten")
        .notEmpty()
        .withMessage("Tên danh mục không được để trống")
        .isLength({ min: 2 })
        .withMessage("Tên danh mục phải có ít nhất 2 ký tự"),
    check("mo_ta")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Mô tả danh mục không được vượt quá 500 ký tự"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }
        next();
    },
];

// Kiểm tra dữ liệu xóa danh mục
const validateDeleteDanhMuc = [
    check("id")
        .notEmpty()
        .withMessage("ID danh mục không được để trống")
        .isNumeric()
        .withMessage("ID danh mục phải là số"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }
        next();
    },
];

module.exports = {
    validateCreateDanhMuc,
    validateUpdateDanhMuc,
    validateDeleteDanhMuc,
};
