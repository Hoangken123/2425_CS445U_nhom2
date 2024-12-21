const knex = require("../config/database");
const { Model } = require('objection');

Model.knex(knex);

<<<<<<< HEAD
class Users extends Model {
  static get tableName() {
    return 'users';
  }
}

module.exports = Users;
=======
<<<<<<<< HEAD:src/model/forget_password.js
class PasswordResetToken extends Model {
    static get tableName() {
        return 'forget_passwords';
    }
}

module.exports = PasswordResetToken; 
========
class Users extends Model {
    static get tableName() {
        return 'users';
    }
}

module.exports = Users;
>>>>>>>> a564eb7929eacaf047d568ad8c16a33642ac4690:src/model/Users.js
>>>>>>> a564eb7929eacaf047d568ad8c16a33642ac4690
