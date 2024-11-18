const knex = require("../config/database");
const { Model } = require('objection');

Model.knex(knex);

class Admin extends Model {
    static get tableName() {
        return 'admins';
    }
}

module.exports = Admin;
