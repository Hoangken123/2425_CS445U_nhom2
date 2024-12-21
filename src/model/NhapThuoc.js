const { Model } = require("objection");
const ChiTietNhapKho = require("./ChiTietNhapKhos");

class DonNhap extends Model {
  static get tableName() {
    return "don_nhaps";
  }

  static get relationMappings() {
    return {
      chi_tiet_nhap_kho: {
        relation: Model.HasManyRelation,
        modelClass: ChiTietNhapKho,
        join: {
          from: "don_nhaps.id",
          to: "chi_tiet_nhap_khos.id_phieu_nhap_kho",
        },
      },
    };
  }
}

module.exports = DonNhap;
