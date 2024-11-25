const Users = require("../model/Users");

const indexNhanVien = (req, res) => {
  res.render("page/nhanvien/index", {
    layout: "../view/share/index",
    title: "Quản lý nhân viên",
    customScript: "/page/nhanvien/index.js",
  });
};

const getNhanVien = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    // Tạo truy vấn cơ bản
    const baseQuery = Users.query()
      .select(
        "users.id",
        "users.ten_hien_thi",
        "users.so_dien_thoai",
        "users.email",
        "users.id_cua_hang",
        "users.day_off",
        "cua_hangs.ten_cua_hang"
      )
      .leftJoin("cua_hangs", "users.id_cua_hang", "cua_hangs.id")
      .where("users.level", 2)
      .where(function () {
        if (search) {
          this.where("users.ten_hien_thi", "like", `%${search}%`)
            .orWhere("users.so_dien_thoai", "like", `%${search}%`)
            .orWhere("users.email", "like", `%${search}%`)
            .orWhere("cua_hangs.ten_cua_hang", "like", `%${search}%`);
        }
      });

    // Lấy dữ liệu nhân viên
    const users = await baseQuery.clone().limit(limit).offset(offset);

    // Đếm tổng số nhân viên thỏa mãn điều kiện
    const totalCount = await baseQuery.resultSize();

    // Trả về dữ liệu
    res.json({
      status: true,
      data: users,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching employee data with store name:", error);
    res.status(500).json({
      status: false,
      message: "Lỗi lấy danh sách nhân viên",
      error: error.message,
    });
  }
};

const deleteNhanVien = async (req,res) =>{
  try {
    const { id } = req.query; 

    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: "ID không hợp lệ" });
    }

    await Users.query().deleteById(id);
    res.json({ status: true, message: "Xóa nhân viên thành công" });
  } catch (error) {
    console.error("Error deleting Unit:", error);
    res.status(500).json({ status: false, message: "Lỗi xóa nhân viên", error });
  }
}
  
const updateNhanVien = async (req,res) =>{
  try {
    const { id, ten_hien_thi, so_dien_thoai,email,id_cua_hang } = req.body;
    const updatedEmployee = await Users.query().findById(id).patch({ ten_hien_thi, so_dien_thoai,email,id_cua_hang });

    if (!updatedEmployee) {
        return res.status(404).json({ status: false, message: 'Đơn vị không tìm thấy' });
    }

    res.json({ status: true, message: 'Cập nhật đơn vị thành công' });
} catch (error) {
    console.error("Error updating Employee:", error);
    res.status(500).json({ status: false, message: "Lỗi cập nhật đơn vị", error });
}
}
module.exports = {
  indexNhanVien,
  getNhanVien,
  deleteNhanVien,
  updateNhanVien
};
