const Admin = require("../model/Admin");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const secretKey = process.env.SESSION_SECRET;

// Trang quản lý admin
const index = (req, res) => {
    res.render("page/admin/index", {
        layout: "../view/share/index",
        title: "Admin",
        customScript: "/page/admin/index.js",
    });
};

// Tạo tài khoản admin
const createAdmin = async (req, res) => {
    try {
        const { ten_dang_nhap, ten_hien_thi, so_dien_thoai, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12); // Mã hóa mật khẩu

        await Admin.query().insert({
            ten_dang_nhap,
            ten_hien_thi,
            so_dien_thoai,
            email,
            password: hashedPassword, // Lưu mật khẩu đã mã hóa
        });

        res.json({ status: true, message: 'Admin created successfully' });
    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({ status: false, message: "Error creating admin" });
    }
};

// Lấy danh sách admin
const data = async (req, res) => {
    try {
        const admins = await Admin.query().select(
            'id',
            'ten_dang_nhap',
            'ten_hien_thi',
            'so_dien_thoai',
            'email'
        ); // Lấy dữ liệu từ bảng admins
        res.json({ status: true, data: admins });
    } catch (error) {
        console.error("Error fetching admin data:", error);
        res.status(500).json({ status: false, message: "Error fetching admin data" });
    }
};

// Cập nhật admin
const updateAdmin = async (req, res) => {
    try {
        const { id, ten_dang_nhap, ten_hien_thi, so_dien_thoai, email } = req.body;

        await Admin.query().findById(id).patch({
            ten_dang_nhap,
            ten_hien_thi,
            so_dien_thoai,
            email,
        });

        res.json({ status: true, message: "Cập nhật thành công" });
    } catch (error) {
        console.error("Error updating admin:", error);
        res.status(500).json({ status: false, message: "Error updating admin" });
    }
};

// Xóa admin
const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.body;

        await Admin.query().deleteById(id); // Xóa admin dựa trên id
        res.json({ status: true, message: "Xóa thành công" });
    } catch (error) {
        console.error("Error deleting admin:", error);
        res.status(500).json({ status: false, message: "Error deleting admin" });
    }
};

module.exports = {
    index,
    createAdmin,
    data,
    updateAdmin,
    deleteAdmin,
};
