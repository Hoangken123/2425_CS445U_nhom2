const { Model } = require("objection");
const knex = require("../config/database");

Model.knex(knex);

class ChiTietNhapKho extends Model {
  static get tableName() {
    return "chi_tiet_nhap_khos";
  }

  static get relationMappings() {
    const DonNhap = require("./NhapThuoc");
    const SanPham = require("./SanPham");
    const CuaHang = require("./CuaHang");
    const User = require("./Users");

    return {
      phieuNhapKho: {
        relation: Model.BelongsToOneRelation,
        modelClass: DonNhap,
        join: {
          from: "chi_tiet_nhap_khos.id_phieu_nhap_kho",
          to: "don_nhaps.id",
        },
      },
      sanPham: {
        relation: Model.BelongsToOneRelation,
        modelClass: SanPham,
        join: {
          from: "chi_tiet_nhap_khos.id_san_pham",
          to: "san_phams.id",
        },
      },
      cuaHang: {
        relation: Model.BelongsToOneRelation,
        modelClass: CuaHang,
        join: {
          from: "chi_tiet_nhap_khos.id_cua_hang",
          to: "cua_hangs.id",
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "chi_tiet_nhap_khos.id_user",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = ChiTietNhapKho;
