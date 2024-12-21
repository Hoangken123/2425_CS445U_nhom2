const { Model } = require('objection');
const knex = require('../config/database');

Model.knex(knex);

class HoaDonBan extends Model {
  static get tableName() {
    return 'hoa_don_ban';
  }

  // static get relationMappings() {
  //   const ChiTietHoaDonBan = require('./ChiTietHoaDonBan');

  //   return {
  //     chi_tiet_hoa_don: {
  //       relation: Model.HasManyRelation,
  //       modelClass: ChiTietHoaDonBan,
  //       join: {
  //         from: 'hoa_don_ban.id',
  //         to: 'chi_tiet_hoa_don_ban.id_hoa_don',
  //       },
  //     },
  //   };
  // }
}

module.exports = HoaDonBan;
