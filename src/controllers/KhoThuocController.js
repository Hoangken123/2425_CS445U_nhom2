const ChiTietNhapKho = require('../model/ChiTietNhapKhos');
const SanPham = require('../model/SanPham');
const NhaCungCap = require('../model/NhaCungCap');
const CuaHang = require('../model/CuaHang');
 const DonNhap = require('../model/NhapThuoc');
const User = require('../model/Users');


// Trang chủ kho thuốc
const indexKhoThuoc = (req, res) => {
    res.render("page/khothuoc/index", {
        layout: "../view/share/index",
        title: "Quản lý Kho thuốc",
        customScript: "/page/khothuoc/index.js",
    });
};
// Lấy danh sách kho thuốc
const getKhoThuoc = async (req, res) => {
  try {
    const data = await ChiTietNhapKho.query().withGraphFetched(
      "[ phieuNhapKho, sanPham, cuaHang, user]"
    );
    console.log(data);
    
    res.json({ status: true, data });
  } catch (error) {
    console.error("Lỗi lấy dữ liệu:", error);
    res.status(500).json({ status: false, message: "Lỗi lấy dữ liệu kho thuốc" });
  }
};
// const getKhoThuoc = async (req, res) => {
//   try {
//     // Nhận các tham số từ query
//     const { page = 1, limit = 10, search = "", sanPhamId, nhaCungCapId } = req.query;
//     const offset = (page - 1) * limit;

//     // Tạo truy vấn cơ sở với JOIN đầy đủ các bảng liên quan
//     const baseQuery = knex("chi_tiet_nhap_khos")
//       .join("san_phams", "chi_tiet_nhap_khos.id_san_pham", "=", "san_phams.id")
//       .join("nha_cung_caps", "chi_tiet_nhap_khos.id_nha_cung_cap", "=", "nha_cung_caps.id")
//       .join("cua_hangs", "chi_tiet_nhap_khos.id_cua_hang", "=", "cua_hangs.id")
//       .join("users", "chi_tiet_nhap_khos.id_user", "=", "users.id")
//       .select(
//         "chi_tiet_nhap_khos.*",
//         "san_phams.ten_san_pham as ten_san_pham",
//         "nha_cung_caps.ten_nha_cung_cap as ten_nha_cung_cap",
//         "cua_hangs.ten_cua_hang as ten_cua_hang",
//         "users.ten_hien_thi as ten_user"
//       )
//       .where(function () {
//         if (search) {
//           this.where("san_phams.ten_san_pham", "like", `%${search}%`)
//             .orWhere("nha_cung_caps.ten_nha_cung_cap", "like", `%${search}%`)
//             .orWhere("users.ten_hien_thi", "like", `%${search}%`);
//         }
//       });

//     // Điều kiện lọc cụ thể
//     if (sanPhamId) baseQuery.andWhere("chi_tiet_nhap_khos.id_san_pham", sanPhamId);
//     if (nhaCungCapId) baseQuery.andWhere("chi_tiet_nhap_khos.id_nha_cung_cap", nhaCungCapId);

//     // Truy vấn dữ liệu với phân trang
//     const khoThuocData = await baseQuery.clone().limit(limit).offset(offset);
//     const totalCount = await baseQuery.clone().count({ count: "*" }).first();

//     // Trả về kết quả
//     res.json({
//       status: true,
//       data: khoThuocData,
//       pagination: {
//         total: Number(totalCount.count),
//         page: Number(page),
//         limit: Number(limit),
//       },
//     });
//   } catch (error) {
//     console.error("Lỗi lấy dữ liệu kho thuốc:", error);
//     res.status(500).json({
//       status: false,
//       message: "Lỗi lấy danh sách kho thuốc",
//       error: error.message,
//     });
//   }
// };



// Thêm mới chi tiết nhập kho
const addKhoThuoc = async (req, res) => {
  try {
    const { id_phieu_nhap_kho, id_san_pham, so_luong, don_gia_nhap, id_cua_hang, id_user, ghi_chu } =
      req.body;

    const thanh_tien = so_luong * don_gia_nhap;

    const newRecord = await ChiTietNhapKho.query().insert({
      id_phieu_nhap_kho,
      id_san_pham,
      so_luong,
      don_gia_nhap,
      thanh_tien,
      id_cua_hang,
      id_user,
      ghi_chu,
    });

    res.json({ status: true, message: "Thêm mới thành công!", data: newRecord });
  } catch (error) {
    console.error("Lỗi thêm dữ liệu:", error);
    res.status(500).json({ status: false, message: "Lỗi thêm kho thuốc" });
  }
};

// Cập nhật chi tiết nhập kho
const updateKhoThuoc = async (req, res) => {
  try {
    const { id } = req.params;
    const { so_luong, don_gia_nhap, ghi_chu } = req.body;

    const thanh_tien = so_luong * don_gia_nhap;

    const updatedRecord = await ChiTietNhapKho.query().patchAndFetchById(id, {
      so_luong,
      don_gia_nhap,
      thanh_tien,
      ghi_chu,
    });

    res.json({ status: true, message: "Cập nhật thành công!", data: updatedRecord });
  } catch (error) {
    console.error("Lỗi cập nhật dữ liệu:", error);
    res.status(500).json({ status: false, message: "Lỗi cập nhật kho thuốc" });
  }
};

// Xóa chi tiết nhập kho
const deleteKhoThuoc = async (req, res) => {
  try {
    const { id } = req.params;

    await ChiTietNhapKho.query().deleteById(id);
    res.json({ status: true, message: "Xóa thành công!" });
  } catch (error) {
    console.error("Lỗi xóa dữ liệu:", error);
    res.status(500).json({ status: false, message: "Lỗi xóa kho thuốc" });
  }
};

module.exports = {
  indexKhoThuoc,
  getKhoThuoc,
  addKhoThuoc,
  updateKhoThuoc,
  deleteKhoThuoc,
};
