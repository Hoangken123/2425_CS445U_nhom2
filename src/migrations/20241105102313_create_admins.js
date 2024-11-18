exports.up = function (knex) {
  return knex.schema.createTable('admins', (table) => {
      table.increments('id').primary();
      table.string('ten_dang_nhap').notNullable();
      table.string('ten_hien_thi').notNullable();
      table.string('so_dien_thoai').nullable();
      table.string('email').notNullable();
      table.string('password').notNullable();
      table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('admins');
};
