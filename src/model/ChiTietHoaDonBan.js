const { Model } = require('objection');
const knex = require('../config/database');

Model.knex(knex);

class ChiTietHoaDonBan extends Model {
  static get tableName() {
    return 'chi_tiet_hoa_don_ban';
  }

  // static get relationMappings() {
  //   const HoaDonBan = require('./HoaDonBan');

  //   return {
  //     hoa_don: {
  //       relation: Model.BelongsToOneRelation,
  //       modelClass: HoaDonBan,
  //       join: {
  //         from: 'chi_tiet_hoa_don_ban.id_hoa_don',
  //         to: 'hoa_don_ban.id',
  //       },
  //     },
  //   };
  // }
}

module.exports = ChiTietHoaDonBan;
