const Admin = require("../model/Admin");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const secretKey = process.env.SESSION_SECRET;

// Trang đăng nhập
const indexLogin = (req, res) => {
    res.render("page/login/index", {
        layout: '../view/page/login/index',
        customScript: "/page/login/index.js",
    });
};

// Đăng nhập
const Login = async (req, res) => {
    try {
        const { ten_dang_nhap, password } = req.body;

        const user = await Admin.query()
            .where('ten_dang_nhap', ten_dang_nhap)
            .orWhere('email', ten_dang_nhap)
            .first();

        if (!user) {
            return res.status(404).json({ message: 'Tên đăng nhập không hợp lệ' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Mật khẩu không hợp lệ' });
        }

        const payload = { ten_dang_nhap: user.ten_dang_nhap, id: user.id };
        const token = jwt.sign(payload, secretKey, { expiresIn: '30m' });

        req.session.user = ten_dang_nhap;

        res.json({ status: true, message: 'Đăng nhập thành công!', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình đăng nhập' });
    }
};

// Đăng xuất
const Logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to logout.');
        }
        res.clearCookie('connect.sid', { path: '/' });
        res.redirect('/login');
    });
};

module.exports = {
    indexLogin,
    Login,
    Logout,
};
