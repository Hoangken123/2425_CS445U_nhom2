const { Model } = require('objection');
const knex = require('../config/database');

Model.knex(knex);

class Donvi extends Model {
    static get tableName() {
        return 'don_vis';
    }
}

module.exports = Donvi;
