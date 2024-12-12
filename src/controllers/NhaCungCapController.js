const NhaCungCap = require("../model/NhaCungCap")
const knex = require("../config/database");

const indexNhaCungCap = (req, res) => {
  res.render("page/nhacungcap/index", {
    layout: "../view/share/index",
    title: "Quản lý nhà cung cấp",
    customScript: "/page/nhacungcap/index.js",
  });
};
// Lấy danh sách nhà cung cấp
const getNhaCungCap = async (req, res) => {
  try {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const offset = (page - 1) * limit;
      const query = NhaCungCap.query()
        .where("ten_nha_cung_cap", "like", `%${search}%`)
        .limit(limit)
        .offset(offset);
  
      const nha_cung_caps = await query;
      const totalCount = await NhaCungCap.query()
        .where("ten_nha_cung_cap", "like", `%${search}%`)
        .resultSize();
      res.json({
        status: true,
        data: nha_cung_caps,
        pagination: {
          total: totalCount,
          page: Number(page),
          limit: Number(limit),
        },
      });
      
    } catch (error) {
      console.error("Error fetching categories:", error);
      res
        .status(500)
        .json({ status: false, message: "Lỗi lấy danh sách đơn vị", error });
    }
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({
      status: false,
      message: "Lỗi lấy danh sách nhà cung cấp",
      error: error.message,
    });
  }
};


  
const addNhaCungCap = async (req, res) => {
  try {
      const { ten, email, shop, address, phone } = req.body;

      if (!ten || !email || !shop || !address || !phone) {
          return res.status(400).json({
              status: false,
              message: "Thiếu thông tin bắt buộc",
          });
      }

      // Lưu dữ liệu vào cơ sở dữ liệu:
      const newProduct = await NhaCungCap.query().insert({
          ten_nha_cung_cap: ten,
          dia_chi: address,
          so_dien_thoai: phone,
          email: email,
          id_cua_hang: shop
      });

      res.json({
          status: true,
          message: "Thêm Nhà Cung Cấp thành công!",
          data: newProduct,
      });
  } catch (error) {
      console.error("Lỗi khi thêm Nhà Cung Cấp:", error);
      return res.status(500).json({
          status: false,
          message: "Lỗi hệ thống khi thêm Nhà Cung Cấp.",
          error: error.message || error,
      });
  }
};

const deleteNhaCungCap = async (req, res) => {
  try {
    const { id } = req.query; 

    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: "ID không hợp lệ" });
    }

    await NhaCungCap.query().deleteById(id);
    res.json({ status: true, message: "Xóa nhà cung cấp thành công" });
  } catch (error) {
    console.error("Error deleting Unit:", error);
    res.status(500).json({ status: false, message: "Lỗi xóa nhà cung cấp ", error });
  }
};
const updateNhaCungCap = async (req, res) => {
  try {
      const { id, ten_nha_cung_cap, dia_chi, so_dien_thoai, email, id_cua_hang } = req.body;
      const updateNhaCungCap = await NhaCungCap.query().findById(id).patch({ ten_nha_cung_cap, dia_chi, so_dien_thoai, email, id_cua_hang });

      if (!updateNhaCungCap) {
          return res.status(404).json({ status: false, message: 'Nhà cung cấp không tìm thấy' });
      }

      res.json({ status: true, message: 'Cập nhật nhà cung cấp thành công' });
  } catch (error) {
      console.error("Error updating nhà cung cấp:", error);
      res.status(500).json({ status: false, message: "Lỗi cập nhật nhà cung cấp", error });
  }
};




module.exports = {
    indexNhaCungCap,
    getNhaCungCap,
    addNhaCungCap,
    deleteNhaCungCap,
    updateNhaCungCap
};