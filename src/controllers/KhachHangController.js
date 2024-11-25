const KhachHang = require("../model/KhachHang");

// Trang quản lý khách hàng
const indexKhachHang = (req, res) => {
    res.render("page/khachhang/index", {
        layout: "../view/share/index",
        title: "Quản lý khách hàng",
        customScript: "/page/khachhang/index.js",
    });
};

// Lấy danh sách khách hàng
const getKhachHang = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const offset = (page - 1) * limit;

        // Tránh việc trùng tên với model
        const khachHangQuery = KhachHang.query()
            .where('ten_khach_hang', 'like', `%${search}%`)
            .limit(limit)
            .offset(offset);

        const khachHangs = await khachHangQuery;  // Lấy dữ liệu trang
        const totalCount = await KhachHang.query()  // Lấy tổng số khách hàng
            .where('ten_khach_hang', 'like', `%${search}%`)
            .resultSize();  // Đảm bảo resultSize() hợp lệ với ORM bạn đang dùng

        res.json({
            status: true,
            data: khachHangs,
            pagination: { total: totalCount, page: Number(page), limit: Number(limit) },
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ status: false, message: "Lỗi lấy danh sách khách hàng", error });
    }
};


// Thêm khách hàng
const addKhachHang = async (req, res) => {
    // Kiểm tra quyền truy cập (chỉ cho phép admin thực hiện)
    // if (!req.user || req.user.role !== 'admin') {
    //     return res.status(403).json({ status: false, message: 'Bạn không có quyền thực hiện thao tác này' });
    // }

    try {
        const { ten_khach_hang, dia_chi, so_dien_thoai, email } = req.body;
        if (!ten_khach_hang || !dia_chi || !so_dien_thoai || !email) {
            return res.status(400).json({ status: false, message: 'Tất cả các trường phải được điền đầy đủ!' });
        }

        const newKhachHang = await KhachHang.query().insert({ ten_khach_hang, dia_chi, so_dien_thoai, email });
        res.json({ status: true, message: 'Thêm khách hàng thành công', data: newKhachHang });
    } catch (error) {
        console.error("Error adding customer:", error);
        res.status(500).json({ status: false, message: "Lỗi thêm khách hàng", error });
    }
};




// Cập nhật khách hàng
const updateKhachHang = async (req, res) => {
    // Kiểm tra quyền truy cập (chỉ cho phép admin thực hiện)
    // if (!req.user || req.user.role !== 'admin') {
    //     return res.status(403).json({ status: false, message: 'Bạn không có quyền thực hiện thao tác này' });
    // }

    try {
        const { ten_khach_hang, dia_chi, so_dien_thoai, email } = req.body;
        const id = req.params.id; // Sử dụng ID từ URL

        const khachHang = await KhachHang.query().where("id_khach_hang", id).first();
        if (!khachHang) {
            return res.status(404).json({
                status: false,
                message: 'Khách hàng không tồn tại',
            });
        }
        console.log("req.body: ", req.body);
        console.log("khachHang: ", khachHang);
        
        await KhachHang.query()
            .where("id_khach_hang", id)
            .patch({ ten_khach_hang, dia_chi, so_dien_thoai, email });

        res.json({
            status: true,
            message: 'Cập nhật khách hàng thành công',
        });
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({
            status: false,
            message: "Lỗi cập nhật khách hàng",
            error,
        });
    }
};





// Xóa khách hàng
// Controller xử lý xóa khách hàng
const deleteKhachHang = async (req, res) => {
    // Kiểm tra quyền truy cập (chỉ cho phép admin thực hiện)
    // if (!req.user || req.user.role !== 'admin') {
    //     return res.status(403).json({ status: false, message: 'Bạn không có quyền thực hiện thao tác này' });
    // }

    try {
        const id = req.params.id; // Lấy ID từ request body
        await KhachHang.query().where("id_khach_hang", id).delete(); 
        res.json({ status: true, message: 'Xóa khách hàng thành công' });
    } catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).json({ status: false, message: "Lỗi xóa khách hàng", error });
    }
};


module.exports = {
    indexKhachHang,
    getKhachHang,
    addKhachHang,
    updateKhachHang,
    deleteKhachHang,
};
