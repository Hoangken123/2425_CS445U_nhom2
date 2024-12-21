const NhapThuoc = require("../model/NhapThuoc");
const ChiTietNhapKhos = require("../model/ChiTietNhapKhos");

const indexnhapkho = (req, res) => {
    res.render("page/nhapkho/index", {
      layout: "../view/share/index",
      title: "Quản lý Nhập kho",
      customScript: "/page/nhapkho/index.js",
    });
  };
// Lấy danh sách đơn nhập kho
const getDonNhap = async (req, res) => {
  try {
    const donNhap = await NhapThuoc.query().withGraphFetched("chiTietNhapKhos");
    res.json({ status: true, data: donNhap });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn nhập kho:", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống." });
  }
};

// Tạo đơn nhập kho mới
const createDonNhap = async (req, res) => {
  const { ma_nhap_kho, thue, id_user, tong_tien, chi_tiet } = req.body;

  try {
    const newDonNhap = await NhapThuoc.query().insert({
      ma_nhap_kho,
      thue,
      id_user,
      tong_tien,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Thêm chi tiết nhập kho
    if (Array.isArray(chi_tiet)) {
      for (const item of chi_tiet) {
        await ChiTietNhapKhos.query().insert({
          id_phieu_nhap_kho: newDonNhap.id,
          id_san_pham: item.id_san_pham,
          so_luong: item.so_luong,
          don_gia_nhap: item.don_gia_nhap,
          thanh_tien: item.so_luong * item.don_gia_nhap,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    res.json({
      status: true,
      message: "Tạo đơn nhập kho thành công!",
      data: newDonNhap,
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn nhập kho:", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống." });
  }
};

// Xóa đơn nhập kho
const deleteDonNhap = async (req, res) => {
  const { id } = req.body;

  try {
    await ChiTietNhapKhos.query().delete().where("id_phieu_nhap_kho", id);
    await NhapThuoc.query().deleteById(id);

    res.json({ status: true, message: "Xóa đơn nhập kho thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa đơn nhập kho:", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống." });
  }
};

module.exports = {
  indexnhapkho,
  getDonNhap,
  createDonNhap,
  deleteDonNhap,
};
