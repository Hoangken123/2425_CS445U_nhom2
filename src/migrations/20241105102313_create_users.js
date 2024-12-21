<<<<<<< HEAD:src/migrations/20241105102313_create_admins.js
// exports.up = function (knex) {
//     return knex.schema.createTable('admins', (table) => {
//         table.increments('id').primary();
//         table.string('ten_dang_nhap').notNullable();
//         table.string('password').notNullable();
//         table.string('email').notNullable();
//         table.timestamps(true, true);
//     });
// };
// exports.down = function(knex) {
//     return knex.schema.dropTable('admins');

// };
=======
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('ten_dang_nhap').notNullable();
      table.string('ten_hien_thi').notNullable();
      table.string('so_dien_thoai').nullable();
      table.string('email').notNullable();
      table.string('password').notNullable();
      table.integer('id_cua_hang').nullable();
      table.integer('id_quyen').nullable();
      table.integer('level').nullable();
      table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('user');
};
>>>>>>> a564eb7929eacaf047d568ad8c16a33642ac4690:src/migrations/20241105102313_create_users.js
