const NhaCungCap = require('../model/NhaCungCap');
const CuaHang = require('../model/CuaHang');
const knex = require('../config/database');

// Validation dữ liệu nhà cung cấp
const validateSupplier = (data) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(0[1-9])([0-9]{8,9})$/;

  if (!data.ten_nha_cung_cap || data.ten_nha_cung_cap.length < 3) {
    throw new Error('Tên nhà cung cấp phải từ 3 ký tự trở lên');
  }
  
  if (!emailRegex.test(data.email)) {
    throw new Error('Email không đúng định dạng');
  }

  if (!phoneRegex.test(data.so_dien_thoai)) {
    throw new Error('Số điện thoại không hợp lệ');
  }
};

// Kiểm tra cửa hàng tồn tại
const checkCuaHangExists = async (id_cua_hang) => {
  const cuaHang = await CuaHang.query().findById(id_cua_hang);
  if (!cuaHang) {
    throw new Error('Cửa hàng không tồn tại');
  }
};

// Hiển thị trang danh sách nhà cung cấp
const indexNhaCungCap = (req, res) => {
  res.render("page/nhacungcap/index", {
    layout: "../view/share/index",
    title: "Quản lý nhà cung cấp",
    customScript: "/page/nhacungcap/index.js",
  });
};

// Tạo mới nhà cung cấp
const createNhaCungCap = async (req, res) => {
  try {
    const { ten_nha_cung_cap, dia_chi, so_dien_thoai, email, id_cua_hang } = req.body;
    
    // Validate dữ liệu
    validateSupplier({ ten_nha_cung_cap, dia_chi, so_dien_thoai, email });
    
    // Kiểm tra cửa hàng
    if (id_cua_hang) {
      await checkCuaHangExists(id_cua_hang);
    }

    // Kiểm tra nhà cung cấp đã tồn tại
    const existingSupplier = await NhaCungCap.query()
      .where('ten_nha_cung_cap', ten_nha_cung_cap)
      .first();

    if (existingSupplier) {
      return res.status(400).json({ 
        status: false, 
        message: 'Nhà cung cấp đã tồn tại!' 
      });
    }

    // Tạo nhà cung cấp mới
    const newSupplier = await NhaCungCap.query().insert({
      ten_nha_cung_cap,
      dia_chi,
      so_dien_thoai,
      email,
      id_cua_hang,
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.json({ 
      status: true, 
      message: 'Nhà cung cấp đã được tạo thành công', 
      data: newSupplier 
    });

  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(400).json({ 
      status: false, 
      message: error.message || 'Lỗi khi tạo nhà cung cấp' 
    });
  }
};


// Lấy danh sách nhà cung cấp với phân trang và tìm kiếm
const getNhaCungCap = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    // Query JOIN bảng cua_hangs để lấy ten_cua_hang
    const suppliers = await knex("nha_cung_caps")
      .leftJoin("cua_hangs", "nha_cung_caps.id_cua_hang", "cua_hangs.id")
      .select(
        "nha_cung_caps.id",
        "nha_cung_caps.ten_nha_cung_cap",
        "nha_cung_caps.dia_chi",
        "nha_cung_caps.so_dien_thoai",
        "nha_cung_caps.email",
        "cua_hangs.ten_cua_hang as ten_chi_nhanh" // Alias cho tên cửa hàng
      )
      .where(function () {
        if (search) {
          this.where("nha_cung_caps.ten_nha_cung_cap", "like", `%${search}%`)
            .orWhere("nha_cung_caps.dia_chi", "like", `%${search}%`)
            .orWhere("nha_cung_caps.so_dien_thoai", "like", `%${search}%`)
            .orWhere("nha_cung_caps.email", "like", `%${search}%`);
        }
      })
      .limit(limit)
      .offset(offset);

    // Tổng số kết quả
    const totalCount = await knex("nha_cung_caps")
      .where("ten_nha_cung_cap", "like", `%${search}%`)
      .count("id as total");

    res.json({
      status: true,
      data: suppliers,
      pagination: {
        total: totalCount[0]?.total || 0,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({
      status: false,
      message: "Lỗi khi lấy danh sách nhà cung cấp",
      error: error.message,
    });
  }
};


// Cập nhật nhà cung cấp
const updateNhaCungCap = async (req, res) => {
  try {
    const { id, ten_nha_cung_cap, dia_chi, so_dien_thoai, email, id_cua_hang } = req.body;

    // Chuyển đổi giá trị rỗng ('') thành null
    const validIdCuaHang = id_cua_hang && id_cua_hang !== '' ? id_cua_hang : null;

    // Validate dữ liệu
    validateSupplier({ ten_nha_cung_cap, dia_chi, so_dien_thoai, email });

    // Kiểm tra cửa hàng nếu id_cua_hang hợp lệ
    if (validIdCuaHang) {
      await checkCuaHangExists(validIdCuaHang);
    }

    const existingSupplier = await NhaCungCap.query().findById(id);
    if (!existingSupplier) {
      return res.status(404).json({ 
        status: false, 
        message: 'Nhà cung cấp không tồn tại' 
      });
    }

    // Thực hiện cập nhật nhà cung cấp
    await NhaCungCap.query().patch({
      ten_nha_cung_cap,
      dia_chi,
      so_dien_thoai,
      email,
      id_cua_hang: validIdCuaHang,
      updated_at: new Date(),
    }).where('id', id);

    res.json({ 
      status: true, 
      message: 'Nhà cung cấp đã được cập nhật thành công' 
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(400).json({ 
      status: false, 
      message: error.message || 'Lỗi khi cập nhật nhà cung cấp' 
    });
  }
};



// Xóa nhà cung cấp
const deleteNhaCungCap = async (req, res) => {
  try {
    const { id } = req.body;

    // Kiểm tra nhà cung cấp tồn tại
    const existingSupplier = await NhaCungCap.query().findById(id);
    if (!existingSupplier) {
      return res.status(404).json({ 
        status: false, 
        message: 'Nhà cung cấp không tồn tại' 
      });
    }

    // // Kiểm tra ràng buộc dữ liệu trong bảng chi_tiet_nhap_khos
    // const relatedImports = await knex('chi_tiet_nhap_khos')
    //   .where('id_nha_cung_cap', id) // Sử dụng cột mới
    //   .count('id as total');

    // if (relatedImports[0]?.total > 0) { 
    //   return res.status(400).json({ 
    //     status: false, 
    //     message: 'Không thể xóa nhà cung cấp đã có phiếu nhập kho' 
    //   });
    // }

    // Xóa nhà cung cấp
    await NhaCungCap.query().delete().where('id', id);

    res.json({ 
      status: true, 
      message: 'Nhà cung cấp đã được xóa thành công' 
    });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ 
      status: false, 
      message: 'Lỗi khi xóa nhà cung cấp', 
      error: error.message 
    });
  }
};


module.exports = {
  indexNhaCungCap,
  createNhaCungCap,
  getNhaCungCap,
  updateNhaCungCap,
  deleteNhaCungCap,
};
