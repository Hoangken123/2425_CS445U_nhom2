const knex = require("../config/database");
const { Model } = require('objection');

Model.knex(knex);

class Users extends Model {
  static get tableName() {
    return 'users';
  }
}

module.exports = Users;
