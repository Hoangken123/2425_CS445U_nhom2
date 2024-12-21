const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SESSION_SECRET;
const Users = require("../model/Users");
// const transporter = require('../config/emailConfig');


// //View forget_password
// const view_forget_password = (req, res) => {
//     res.render("page/forget_password/index", {
//       layout: "../view/page/forget_password/index",
//       customScript: "/page/forget_password/index.js",
//     });
//   };
// // API cho Quên mật khẩu
// const forgetPassword = async (req, res) => {
//     const { email } = req.body;
//     console.log(process.env.EMAIL_USER, email);
    
//     try {
//         // Kiểm tra email trong hệ thống
//         const user = await Users.query().findOne({ email });

//         if (!user) {
//             return res.status(400).json({
//                 status: false,
//                 message: "Email không tồn tại!",
//             });
//         }

//         // Tạo mã token
//         const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: "1h" });

//         // Tạo liên kết với mã token
//         const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;

//         // Nội dung email
//         const mailOptions = {
//             from: process.env.EMAIL_USER, // Địa chỉ gửi mail
//             to: email, // Địa chỉ nhận mail (do người dùng nhập)
//             subject: "Reset Password",
//             text: `Click vào link sau để đặt lại mật khẩu của bạn: ${resetLink}`,
//         };

//         // Gửi email
//         await transporter.sendMail(mailOptions);
//         console.log("Email sent successfully to:", email);

//         return res.json({
//             status: true,
//             message: "Đã gửi email xác nhận, vui lòng kiểm tra hộp thư!",
//         });
//     } catch (error) {
//         console.error("Error sending reset password email:", error);
//         return res.status(500).json({
//             status: false,
//             message: "Lỗi hệ thống khi gửi email!",
//         });
//     }
// };

// // API cho reset mật khẩu
// const resetPassword = async (req, res) => {
//     const { token } = req.params; // Lấy token từ URL
//     const { password } = req.body; // Lấy mật khẩu mới từ request body
  
//     try {
//       // 1. Xác minh mã token
//       const decoded = jwt.verify(token, process.env.SESSION_SECRET); // Đảm bảo dùng SESSION_SECRET từ .env
  
//       // 2. Kiểm tra xem email có hợp lệ trong database không
//       const user = await Users.query().findOne({ email: decoded.email });
//       if (!user) {
//         return res.status(400).json({
//           status: false,
//           message: "Token không hợp lệ hoặc tài khoản không tồn tại!",
//         });
//       }
  
//       // 3. Kiểm tra độ mạnh của mật khẩu mới
//       if (password.length < 8) {
//         return res.status(400).json({
//           status: false,
//           message: "Mật khẩu phải chứa ít nhất 8 ký tự!",
//         });
//       }
  
//       // 4. Mã hóa mật khẩu mới
//       const hashedPassword = await bcrypt.hash(password, 10);

//       // 5. Cập nhật mật khẩu mới trong cơ sở dữ liệu
//       await Users.query()
//         .patch({ password: hashedPassword })
//         .where({ email: decoded.email });
  
//       return res.json({
//         status: true,
//         message: "Mật khẩu đã được thay đổi thành công!",
//       });
//     } catch (error) {
//       // 6. Log lỗi nếu xảy ra vấn đề
//       if (error.name === "TokenExpiredError") {
//         return res.status(400).json({
//           status: false,
//           message: "Token đã hết hạn, vui lòng yêu cầu reset mật khẩu mới!",
//         });
//       }
  
//       console.error("Error resetting password:", error);
//       return res.status(500).json({
//         status: false,
//         message: "Lỗi hệ thống khi thay đổi mật khẩu!",
//       });
//     }
//   };
  

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
        message: "User not found!",
        redirectUrl: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Incorrect password!",
        redirectUrl: null,
      });
    }

    req.session.user = user;

    return res.json({
      status: true,
      message: "Login successful",
      redirectUrl: "/admin/danh-muc",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error occurred during login!",
      redirectUrl: null,
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
    const { ten_dang_nhap, ten_hien_thi, so_dien_thoai, email, password } =
      req.body;

    if (
      !ten_dang_nhap ||
      !ten_hien_thi ||
      !so_dien_thoai ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        status: false,
        message: "Tất cả các trường là bắt buộc.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const User = await Users.query().insert({
      ten_dang_nhap,
      ten_hien_thi,
      so_dien_thoai,
      email,
      password: hashedPassword,
      id_cua_hang: null,
      id_quyen: null,
      level: 1,
    });

    return res.json({
      status: true,
      message: "Đăng kí tài khoản thành công!",
      data: User,
    });
  } catch (error) {
    console.error("Lỗi khi Đăng kí tài khoản:", error);
    return res.status(500).json({
      status: false,
      message: "Lỗi hệ thống khi Đăng kí tài khoản.",
    });
  }
};

module.exports = {
  // view_forget_password,
  // forgetPassword,
  // resetPassword,
  indexLogin,
  Login,
  Logout,
  viewRegister,
  handleRegister,
};
