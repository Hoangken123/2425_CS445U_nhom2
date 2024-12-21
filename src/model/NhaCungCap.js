const { Model } = require('objection');
const knex = require('../config/database');

<<<<<<< HEAD
class NhaCungCap extends Model {
  static get tableName() {
    return 'nha_cung_caps';
  }

  static get relationMappings() {
    const CuaHang = require('./CuaHang');
    return {
      cua_hang: {
        relation: Model.BelongsToOneRelation,
        modelClass: CuaHang,
        join: {
          from: 'nha_cung_caps.id_cua_hang',
          to: 'cua_hangs.id',
        },
      },
    };
  }

  $beforeInsert() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0[1-9])([0-9]{8,9})$/;

    if (!this.ten_nha_cung_cap || this.ten_nha_cung_cap.length < 3) {
      throw new Error('Tên nhà cung cấp phải từ 3 ký tự trở lên');
    }

    if (this.email && !emailRegex.test(this.email)) {
      throw new Error('Email không đúng định dạng');
    }

    if (this.so_dien_thoai && !phoneRegex.test(this.so_dien_thoai)) {
      throw new Error('Số điện thoại không hợp lệ');
    }
  }
=======
Model.knex(knex);

class NhaCungCap extends Model {
    static get tableName() {
        return 'nha_cung_caps'; 
    }
>>>>>>> a564eb7929eacaf047d568ad8c16a33642ac4690
}

module.exports = NhaCungCap;
