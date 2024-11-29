const knex = require("../config/database");
const { Model } = require('objection');

Model.knex(knex);

class PasswordResetToken extends Model {
    static get tableName() {
        return 'password_reset_tokens';
    }
}

module.exports = PasswordResetToken; 
