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
