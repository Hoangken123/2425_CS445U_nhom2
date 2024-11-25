const Cuahang = require('../model/CuaHang')
 
const indexCuaHang = (req, res) => {
    res.render("page/cuahang/index", {
      layout: "../view/share/index",
      title: "Quản lý cưa hàng",
      customScript: "/page/cuahang/index.js",
    });
  };
  //GET DATA CUAHANG
  const getCuaHang = async (req,res) =>{
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const offset = (page - 1) * limit;
      const query = Cuahang.query()
        .where("ten_cua_hang", "like", `%${search}%`)
        .limit(limit)
        .offset(offset);
  
      const cua_hang = await query;
      const totalCount = await Cuahang.query()
        .where("ten_cua_hang", "like", `%${search}%`)
        .resultSize();
      res.json({
        status: true,
        data: cua_hang,
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
  }
  // ADD-CUA-HANG
  const addCuaHang = async (req, res) => {
    try {
      const { ten_cua_hang, slug_cua_hang,dia_chi } = req.body;

      const existingCuaHang = await Cuahang.query()
      .where({ slug_cua_hang })
      .orWhere({ ten_cua_hang })
      .first();

      if (existingCuaHang) {
        return res.status(400).json({
          status: false,
          message: "Nhà thuốc đã tồn tại!",
        });

      }
      const newCuaHang = await Cuahang.query().insert({ ten_cua_hang, slug_cua_hang ,dia_chi});
      res.json({
        status: true,
        message: "Thêm Chi Nhánh Nhà thuốc thành công!",
        data: newCuaHang,
      });
    } catch (error) {
      console.error("lỗi thêm mới Chi Nhánh Nhà thuốc", error);
      res
        .status(500)
        .json({ status: false, message: "Lỗi thêm Chi Nhánh Nhà thuốc!", error });
    }
  };
  // DELETE-CUA-HANG
  const deleteCuaHang = async (req,res) =>{
    try {
      const { id } = req.query; 
  
      if (!id) {
        return res
          .status(400)
          .json({ status: false, message: "ID không hợp lệ" });
      }
  
      await Cuahang.query().deleteById(id);
      res.json({ status: true, message: "Xóa Cửa hàng thành công" });
    } catch (error) {
      console.error("Error deleting Unit:", error);
      res.status(500).json({ status: false, message: "Lỗi xóa Cửa hàng", error });
    }
  }
  //UPDATE-CUA-HANG
  const updateCuaHang = async (req, res) => {
    try {
        const { id,ten_cua_hang, slug_cua_hang,dia_chi } = req.body;
        const updatedUnit = await Cuahang.query().findById(id).patch({ ten_cua_hang, slug_cua_hang,dia_chi });
  
        if (!updatedUnit) {
            return res.status(404).json({ status: false, message: 'cửa hàng không tìm thấy' });
        }
  
        res.json({ status: true, message: 'Cập nhật cửa hàng thành công' });
    } catch (error) {
        console.error("Error updating unit:", error);
        res.status(500).json({ status: false, message: "Lỗi cập nhật cửa hàng", error });
    }
  };
module.exports = {
    indexCuaHang,
    addCuaHang,
    getCuaHang,
    deleteCuaHang,
    updateCuaHang
}

