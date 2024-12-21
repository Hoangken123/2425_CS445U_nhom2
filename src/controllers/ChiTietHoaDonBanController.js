const knex = require('../config/database');

const indexChiTietHoaDonBan = async (req, res) => {
    res.render("page/chiTietHoaDonBan/index", {
        layout: "../view/share/index",
        title: "Chi Tiết Hóa Đơn Bán",
        customScript: "/page/chiTietHoaDonBan/index.js",
    });
};

const getChiTietHoaDonBan = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", hoaDonId } = req.query;
        const offset = (page - 1) * limit;

        const baseQuery = knex("chi_tiet_hoa_don_ban")
            .join("hoa_don_ban", "chi_tiet_hoa_don_ban.id_hoa_don", "=", "hoa_don_ban.id")
            .select(
                "chi_tiet_hoa_don_ban.*",
                "hoa_don_ban.ngay_ban",
                "hoa_don_ban.tong_tien",
                "hoa_don_ban.ghi_chu as hoa_don_ghi_chu"
            )
            .where(function () {
                if (search) {
                    this.where("chi_tiet_hoa_don_ban.ten_san_pham", "like", `%${search}%`);
                }
            });

        if (hoaDonId) baseQuery.andWhere("chi_tiet_hoa_don_ban.id_hoa_don", hoaDonId);

        const chiTietData = await baseQuery.clone().limit(limit).offset(offset);
        const totalCount = await baseQuery.clone().count({ count: "*" }).first();

        res.json({
            status: true,
            data: chiTietData,
            pagination: {
                total: Number(totalCount.count),
                page: Number(page),
                limit: Number(limit),
            },
        });
    } catch (error) {
        console.error("Error fetching chi tiết hóa đơn bán:", error);
        res.status(500).json({
            status: false,
            message: "Có lỗi xảy ra khi lấy danh sách chi tiết hóa đơn bán",
            error: error.message,
        });
    }
};

module.exports = {
    indexChiTietHoaDonBan,
    getChiTietHoaDonBan,
};
