const Donvi = require("../model/Donvi");
const { data } = require("./AdminController");

const indexDonVi = (req, res) => {
  res.render("page/donvi/index", {
    layout: "../view/share/index",
    title: "Quản lý đơn vị",
    customScript: "/page/donvi/index.js",
  });
};

const getDonVi = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;
    const query = Donvi.query()
      .where("ten_don_vi", "like", `%${search}%`)
      .limit(limit)
      .offset(offset);

    const don_vis = await query;
    const totalCount = await Donvi.query()
      .where("ten_don_vi", "like", `%${search}%`)
      .resultSize();
    res.json({
      status: true,
      data: don_vis,
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
};
const addDonVi = async (req, res) => {
  try {
    const { ten_don_vi, slug_don_vi } = req.body;
    const newDonVi = await Donvi.query().insert({ ten_don_vi, slug_don_vi });
    res.json({
      status: true,
      message: "Thêm đơn vị thuốc thành công!",
      data: newDonVi,
    });
  } catch (error) {
    console.error("lỗi thêm mới đơn vị thuốc", error);
    res
      .status(500)
      .json({ status: false, message: "Lỗi thêm đơn vị thuốc!", error });
  }
};

const deleteDonVi = async (req, res) => {
  try {
    const { id } = req.query; 

    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: "ID không hợp lệ" });
    }

    await Donvi.query().deleteById(id);
    res.json({ status: true, message: "Xóa đơn vị thành công" });
  } catch (error) {
    console.error("Error deleting Unit:", error);
    res.status(500).json({ status: false, message: "Lỗi xóa đơn vị", error });
  }
};
const updateDonVi = async (req, res) => {
  try {
      const { id, ten_don_vi, slug_don_vi } = req.body;
      const updatedUnit = await Donvi.query().findById(id).patch({ ten_don_vi, slug_don_vi });

      if (!updatedUnit) {
          return res.status(404).json({ status: false, message: 'Đơn vị không tìm thấy' });
      }

      res.json({ status: true, message: 'Cập nhật đơn vị thành công' });
  } catch (error) {
      console.error("Error updating unit:", error);
      res.status(500).json({ status: false, message: "Lỗi cập nhật đơn vị", error });
  }
};

module.exports = { indexDonVi, getDonVi, addDonVi, deleteDonVi,updateDonVi };
