const knex = require('../config/database');

const indexSellPage  = async (req,res) =>{
    res.render("page/sellproduct/index", {
        layout: "../view/share/index",
        title: "Quản lý bán hàng ",
        customScript: "/page/sellproduct/index.js",
      });
}
const addToinvoice = async (req,res) =>{
    console.log(req.body);
    
}
const saveInvoice = async (req, res) => {
    try {
        const { tong_tien, chiet_khau, phi_dich_vu, thanh_toan, khach_hang, san_pham } = req.body;

        await knex.transaction(async (trx) => {
            
            const [invoiceId] = await trx('hoa_don_ban').insert({
                id_cua_hang: 1, 
                id_khach_hang: null,
                tong_tien: tong_tien,
                trang_thai: 1,
                ngay_ban: knex.fn.now(),
                ghi_chu: `Chiết khấu: ${chiet_khau}, Phí dịch vụ: ${phi_dich_vu}`
            });

            
            const detailRecords = san_pham.map(product => ({
                id_hoa_don: invoiceId,
                ten_san_pham: product.ten_san_pham,
                gia_ban: product.gia_ban,
                so_luong: product.so_luong,
                DVT: product.DVT,
                trang_thai: 1,
                thanh_tien: product.thanh_tien,
                ghi_chu: null
            }));

            
            await trx('chi_tiet_hoa_don_ban').insert(detailRecords);
        });

        res.json({
            success: true,
            message: "Hóa đơn đã được lưu thành công"
        });

    } catch (error) {
        console.error("Error saving invoice:", error);
        res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi lưu hóa đơn: " + error.message
        });
    }
};

module.exports ={
    indexSellPage,
    addToinvoice,
    saveInvoice
}