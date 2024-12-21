const DanhMuc = require("../model/DanhMuc");

// Trang quản lý danh mục
const indexDanhMuc = (req, res) => {
    res.render("page/danhmuc/index", {
        layout: "../view/share/index",
        title: "Quản lý danh mục",
        customScript: "/page/danhmuc/index.js",
    });
};

// Lấy danh sách danh mục
const getDanhMuc = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const offset = (page - 1) * limit;

        const query = DanhMuc.query().where('ten', 'like', `%${search}%`).limit(limit).offset(offset);
        const danhMucs = await query;
        const totalCount = await DanhMuc.query().where('ten', 'like', `%${search}%`).resultSize();

        res.json({
            status: true,
            data: danhMucs,
            pagination: { total: totalCount, page: Number(page), limit: Number(limit) },
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ status: false, message: "Lỗi lấy danh sách danh mục", error });
    }
};

// Thêm danh mục
const addDanhMuc = async (req, res) => {
    try {
        const { ten, mo_ta } = req.body;
        const newDanhMuc = await DanhMuc.query().insert({ ten, mo_ta });
        res.json({ status: true, message: 'Thêm danh mục thành công', data: newDanhMuc });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ status: false, message: "Lỗi thêm danh mục", error });
    }
};


// Cập nhật danh mục
const updateDanhMuc = async (req, res) => {
    try {
        const { id, ten, mo_ta } = req.body;
        await DanhMuc.query().findById(id).patch({ ten, mo_ta });
        res.json({ status: true, message: 'Cập nhật danh mục thành công' });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ status: false, message: "Lỗi cập nhật danh mục", error });
    }
};

// Xóa danh mục
const deleteDanhMuc = async (req, res) => {
    try {
        const { id } = req.body; // Lấy ID từ request body
        await DanhMuc.query().deleteById(id); // Xóa danh mục theo ID
        res.json({ status: true, message: 'Xóa danh mục thành công' });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ status: false, message: "Lỗi xóa danh mục", error });
    }
};

module.exports = {
    indexDanhMuc,
    getDanhMuc,
    addDanhMuc,
    updateDanhMuc,
    deleteDanhMuc,
};
