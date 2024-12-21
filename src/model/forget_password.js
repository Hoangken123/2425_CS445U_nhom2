const knex = require("../config/database");
const { Model } = require("objection");

Model.knex(knex);

class PasswordResetToken extends Model {
  static get tableName() {
    return "forget_passwords";
  }
}

module.exports = PasswordResetToken;

