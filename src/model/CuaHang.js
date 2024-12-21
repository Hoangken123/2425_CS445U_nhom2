const { Model } = require('objection');
const knex = require('../config/database');

Model.knex(knex);

class CuaHang extends Model {
    static get tableName() {
        return 'cua_hangs'; 
    }
}

module.exports = CuaHang;
