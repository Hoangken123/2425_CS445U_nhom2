const Users = require("../model/Users");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const PasswordResetTokens = require("../model/PasswordResetToken");
// Config Email
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "hale.02031982@gmail.com",
    pass: "epgifaztvtwvkbtm",
  },
});

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
    const {
      ten_dang_nhap,
      ten_hien_thi,
      so_dien_thoai,
      email,
      password,
      level,
    } = req.body;

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
      level: level,
    });

    return res.json({
      status: true,
      message: "Thêm mới tài khoản thành công!",
      data: User,
    });
  } catch (error) {
    console.error("Lỗi khi thêm mới tài khoản:", error);
    return res.status(500).json({
      status: false,
      message: "Lỗi hệ thống khi thêm mới tài khoản.",
    });
  }
};

// Lấy danh sách admin
const data = async (req, res) => {
  try {
    const users = await Users.query().select(
      "id",
      "ten_dang_nhap",
      "ten_hien_thi",
      "so_dien_thoai",
      "email",
      "level",
      "id_cua_hang",
      "id_quyen"
    );
    res.json({ status: true, data: users });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res
      .status(500)
      .json({ status: false, message: "Error fetching admin data" });
  }
};

// Cập nhật admin
const updateAdmin = async (req, res) => {
  try {
    const {
      id,
      ten_dang_nhap,
      ten_hien_thi,
      so_dien_thoai,
      email,
      level,
      id_cua_hang,
      id_quyen,
    } = req.body;

    await Users.query()
      .findById(id)
      .patch({
        ten_dang_nhap,
        ten_hien_thi,
        so_dien_thoai,
        email,
        level: level ? level : undefined,
        id_cua_hang: id_cua_hang ? id_cua_hang : undefined,
        id_quyen: id_quyen ? id_quyen : undefined,
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
const changePassword = async (req, res) => {
  try {
    const { id, newPassWord, re_Password } = req.body;

    if (newPassWord !== re_Password) {
      res
        .status(500)
        .json({ status: false, message: "Xác nhận mật khẩu không trùng nhau" });
    }
    const hashedPassword = await bcrypt.hash(newPassWord, 10);

    await Users.query().findById(id).patch({
      password: hashedPassword,
    });
    res.json({ status: true, message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Error change password users:", error);
    res
      .status(500)
      .json({ status: false, message: "Error changepassword users" });
  }
};
//Quên Mật Khẩu
const viewlostpassword = async (req, res) => {
  res.render("page/lostpassword/index", {
    layout: "../view/page/lostpassword/index",
    title: "lostpassword",
    customScript: "/page/lostpassword/index.js",
  });
};
//SEND-EMAIL
const emailCooldowns = {};
const handleLostPassword = async (req, res) => {
  try {
    const { email, link } = req.body;
    const user = await Users.query().where("email", email).first();

    if (!user) {
      return res
        .status(404)
        .json({ error: "Email không tồn tại trong hệ thống!" });
    }
    // Check cooldown
    const now = Date.now();
    if (emailCooldowns[email] && now - emailCooldowns[email] < 10000) {
      return res
        .status(429)
        .json({ error: "Bạn chỉ có thể gửi lại sau 10 giây!" });
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 3600 * 1000);
    //Save to database
    await PasswordResetTokens.query().insert({
      user_id: user.id,
      token,
      expires_at: tokenExpiry,
    });
    //link send Email
    const linkSendEmail = `${link}/reset-password/${token}`;

    const mailOptions = {
      from: "hale.02031982@gmail.com",
      to: email,
      subject: "Đây là mã cập nhật lại mật khẩu của bạn!",
      text: "Đây là liên kết để đặt lại mật khẩu của bạn  : " + linkSendEmail,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error:", error.message);
        return res
          .status(500)
          .json({ error: "Không thể gửi email, vui lòng thử lại sau!" });
      } else {
        console.log("Email sent", info.response);
        return res.json({
          message: "Link Cập nhật tài khoản đã được gửi đến bạn!",
        });
      }
    });

    return res.json({
      message: "Link Cập nhật tài khoản đã được gửi đến bạn!",
    });
  } catch (error) {
    res.status(400).json({ message: "Lỗi hệ thống!!" });
  }
};
//VIEW-RESETPASSWORD
const viewResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find the token in the database
    const record = await PasswordResetTokens.query()
      .where("token", token)
      .andWhere("expires_at", ">", new Date())
      .first();

    if (!record) {
      return res
        .status(400)
        .json({ error: "Token không hợp lệ hoặc đã hết hạn!" });
    }

    res.render("page/resetpassword/index", {
      layout: "../view/page/resetpassword/index",
      title: "resetpassword",
      customScript: "/page/resetpassword/index.js",
      userId: record.user_id,

    });
  } catch (error) {
    console.error("Error rendering reset password page:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
const handleResetPassword = async (req,res) =>{
    try {
        const { token, newPassword } = req.body;

        //code  kiểm tra token còn tồn tại không!
        const record = await PasswordResetTokens.query().where("token", token).andWhere("expires_at", ">", new Date()).first();
        if (!record) {
            return res.status(400).json({ error: "Token đã hết hạn không thể reset!" });
        }
        //code  kiểm tra token còn tồn tại không!

        
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update
        await Users.query().where("id", record.user_id).update({password: hashedPassword,});

        //update thành công thì xoá token đó đi ! :))
        await PasswordResetTokens.query().where("id", record.id).delete();

        return res.json({ message: "Mật khẩu đã được đặt lại thành công!" });
    } catch (error) {
        console.error("Lỗi khi đặt lại mật khẩu:", error.message);
        res.status(500).json({ error: "Lỗi máy chủ nội bộ!" });
    }
    
}
module.exports = {
  index,
  data,
  deleteAdmin,
  createAdmin,
  updateAdmin,
  changePassword,
  viewlostpassword,
  handleLostPassword,
  viewResetPassword,
  handleResetPassword
};
