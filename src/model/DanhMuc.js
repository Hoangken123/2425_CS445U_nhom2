const { Model } = require('objection');
const knex = require('../config/database');

Model.knex(knex);

class DanhMuc extends Model {
    static get tableName() {
        return 'danh_muc'; 
    }
}

module.exports = DanhMuc;
