const { check, validationResult } = require('express-validator');
const Donvi = require("../../model/Donvi.js");
const validateCreateDonVi = [
    check("ten_don_vi")
        .notEmpty()
        .withMessage("Tên đơn vị không được để trống")
        .isLength({ min: 2 })
        .withMessage("Tên đơn vị phải có ít nhất 2 ký tự"),
    
    check("slug_don_vi")
        .notEmpty()
        .withMessage("Đơn vị không được để trống")
        .custom(async (slug_don_vi) => {
            const existingUnit = await Donvi.query().findOne({ slug_don_vi });
            if (existingUnit) {
                throw new Error("Đơn vị đã tồn tại");
            }
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }
        next();
    },
];
const validateUpdateDonVi = [
    check("ten_don_vi")
        .notEmpty()
        .withMessage("Tên đơn vị không được để trống")
        .isLength({ min: 2 })
        .withMessage("Tên đơn vị phải có ít nhất 2 ký tự"),

    check("slug_don_vi")
        .notEmpty()
        .withMessage("Đơn vị không được để trống")
        .custom(async (slug_don_vi, { req }) => {
            const existingUnit = await Donvi.query().findOne({ slug_don_vi });
            if (existingUnit && existingUnit.id !== req.params.id) { 
                throw new Error("Đơn vị đã tồn tại");
            }
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }
        next();
    },
];

module.exports = { validateCreateDonVi ,validateUpdateDonVi};
