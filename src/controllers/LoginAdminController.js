const Users = require("../model/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SESSION_SECRET;

// Trang đăng nhập
const indexLogin = (req, res) => {
  res.render("page/login/index", {
    layout: "../view/page/login/index",
    customScript: "/page/login/index.js",
  });
};

// Đăng nhập
// Server-side Login controller
const Login = async (req, res) => {     
    try {
        const { email, password } = req.body;
        const user = await Users.query().findOne({ email });
        
        if (!user) {
            return res.status(400).json({
                status: false,
                message: 'User not found!',
                redirectUrl: null
            });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                status: false,
                message: 'Incorrect password!',
                redirectUrl: null
            });
        }
        
        req.session.user = user;
        
        return res.json({
            status: true,
            message: 'Login successful',
            redirectUrl: '/admin/danh-muc'
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            status: false,
            message: 'Server error occurred during login!',
            redirectUrl: null
        });
    }
};



// Đăng xuất
const Logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to logout.");
    }
    res.clearCookie("connect.sid", { path: "/" });
    res.redirect("/login");
  });
};
//View Register
const viewRegister = (req, res) => {
  res.render("page/register/index", {
    layout: "../view/page/register/index",
    customScript: "/page/register/index.js",
  });
};
//Đăng Kí
const handleRegister = async (req, res) => {
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
            level:1
        });

        return res.json({
            status: true,
            message: 'Đăng kí tài khoản thành công!',
            data: User,
        });
    } catch (error) {
        console.error('Lỗi khi Đăng kí tài khoản:', error);
        return res.status(500).json({
            status: false,
            message: 'Lỗi hệ thống khi Đăng kí tài khoản.',
        });
    }
};

module.exports = {
  indexLogin,
  Login,
  Logout,
  viewRegister,
  handleRegister,
};
