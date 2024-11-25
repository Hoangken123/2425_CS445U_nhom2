const { Model } = require('objection');
const knex = require('../config/database');

Model.knex(knex);

class KhachHang extends Model {
    static get tableName() {
        return 'khach_hangs'; 
    }
}

module.exports = KhachHang;
