const { Model } = require('objection');
const knex = require('../config/database');

Model.knex(knex);

class NhaCungCap extends Model {
    static get tableName() {
        return 'nha_cung_caps'; 
    }
}

module.exports = NhaCungCap;
