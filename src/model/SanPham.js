const { Model } = require('objection');
const knex = require('../config/database');

Model.knex(knex);

class SanPham extends Model {
    static get tableName() {
        return 'san_phams';
    }
}

module.exports = SanPham;
