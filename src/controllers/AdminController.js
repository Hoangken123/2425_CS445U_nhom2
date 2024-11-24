const Users = require("../model/Users");
const bcrypt = require("bcryptjs");

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
        const { ten_dang_nhap, ten_hien_thi, so_dien_thoai, email, password } = req.body;

        if (!ten_dang_nhap || !ten_hien_thi || !so_dien_thoai || !email || !password) {
            return res.status(400).json({
                status: false,
                message: 'Tất cả các trường là bắt buộc.',
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10); 
        const User = await Users.query().insert({
            ten_dang_nhap,
            ten_hien_thi,
            so_dien_thoai,
            email,
            password : hashedPassword,
            id_cua_hang : null,
            id_quyen:null,
            level:0
        });

        return res.json({
            status: true,
            message: 'Thêm mới tài khoản thành công!',
            data: User,
        });
    } catch (error) {
        console.error('Lỗi khi thêm mới tài khoản:', error);
        return res.status(500).json({
            status: false,
            message: 'Lỗi hệ thống khi thêm mới tài khoản.',
        });
    }
};

// Lấy danh sách admin
const data = async (req, res) => {
    try {
        const users = await Users.query().select(
            'id',
            'ten_dang_nhap',
            'ten_hien_thi',
            'so_dien_thoai',
            'email',
            'level',
            'id_cua_hang',
            'id_quyen'

        ); 
        res.json({ status: true, data: users });
    } catch (error) {
        console.error("Error fetching admin data:", error);
        res.status(500).json({ status: false, message: "Error fetching admin data" });
    }
};

// Cập nhật admin
const updateAdmin = async (req, res) => {
    try {
        const { id, ten_dang_nhap, ten_hien_thi, so_dien_thoai, email,level,id_cua_hang,id_quyen } = req.body;

        await Users.query().findById(id).patch({
            ten_dang_nhap,
            ten_hien_thi,
            so_dien_thoai,
            email,
            level       : level ? level:undefined,
            id_cua_hang : id_cua_hang ? id_cua_hang : undefined,
            id_quyen    : id_quyen ? id_quyen : undefined,
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

        await Users.query().deleteById(id); 
        res.json({ status: true, message: "Xóa thành công" });
    } catch (error) {
        console.error("Error deleting admin:", error);
        res.status(500).json({ status: false, message: "Error deleting admin" });
    }
};
// Đổi mật khẩu
const changePassword = async (req,res) =>{
    try {
        const {id , newPassWord, re_Password }  = req.body;

        if (newPassWord !== re_Password) {
            res.status(500).json({ status: false, message: "Xác nhận mật khẩu không trùng nhau" });
        }
        const hashedPassword = await bcrypt.hash(newPassWord, 10); 

        await Users.query().findById(id).patch({
            password: hashedPassword
        })
        res.json({ status: true, message: "Đổi mật khẩu thành công!" });
    } catch (error) {
        console.error("Error change password users:", error);
        res.status(500).json({ status: false, message: "Error changepassword users" });
    }
     
}
module.exports = {
    index,
    data,
    deleteAdmin,
    createAdmin,
    updateAdmin,
    changePassword
};
