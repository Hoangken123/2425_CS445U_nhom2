const SanPham = require("../model/SanPham");
const knex = require('../config/database'); 

const indexsanPham = (req, res) => {
  res.render("page/sanpham/index", {
    layout: "../view/share/index",
    title: "Quản lý sản phẩm ",
    customScript: "/page/sanpham/index.js",
  });
};


const getsanPham = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", donViId, danhMucId } = req.query;
    const offset = (page - 1) * limit;

    const baseQuery = knex("san_phams")
      .join("don_vis", "san_phams.id_don_vi", "=", "don_vis.id")
      .join("danh_muc", "san_phams.id_danh_muc", "=", "danh_muc.id")
      .select(
        "san_phams.*",
        "don_vis.ten_don_vi as ten_don_vi",
        "danh_muc.ten as ten_danh_muc"
      )
      .where(function () {
        if (search) {
          this.where("san_phams.ten_san_pham", "like", `%${search}%`)
            .orWhere("don_vis.ten_don_vi", "like", `%${search}%`)
            .orWhere("danh_muc.ten", "like", `%${search}%`);
        }
      });

    if (donViId) baseQuery.andWhere("san_phams.id_don_vi", donViId);
    if (danhMucId) baseQuery.andWhere("san_phams.id_danh_muc", danhMucId);

    const sanPhamData = await baseQuery.clone().limit(limit).offset(offset);
    const totalCount = await baseQuery.clone().count({ count: "*" }).first();

    res.json({
      status: true,
      data: sanPhamData,
      pagination: {
        total: Number(totalCount.count),
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      status: false,
      message: "Lỗi lấy danh sách sản phẩm",
      error: error.message,
    });
  }
};

// ADD-PRODUCT
const addsanPham = async (req, res) => {

  try {
    const imagepath = `/uploads/products/${req.file.filename}`;
    const {ten_san_pham,slug_san_pham,han_su_dung,so_luong,gia_ban,id_don_vi,id_danh_muc,} = req.body;
    // Lưu dữ liệu vào cơ sở dữ liệu:
    const newProduct = await SanPham.query().insert({ten_san_pham,slug_san_pham:slug_san_pham ,hinh_anh: imagepath,han_su_dung,so_luong,id_don_vi,gia_ban,id_danh_muc});
    res.json({
      status: true,
      message: "Thêm đơn vị thuốc thành công!",
      data: newProduct,
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    return res.status(500).json({
      status: false,
      message: "Lỗi hệ thống khi thêm sản phẩm.",
    });
  }
};
// DELETE-PRODUCT 
const deletesanPham = async (req,res) =>{
  try {
    const { id } = req.query; 

    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: "ID không hợp lệ" });
    }

    await SanPham.query().deleteById(id);
    res.json({ status: true, message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Error deleting Unit:", error);
    res.status(500).json({ status: false, message: "Lỗi xóa sản phẩm", error });
  }
}

module.exports = {
  indexsanPham,
  addsanPham,
  getsanPham,
  deletesanPham
};
