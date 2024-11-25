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
      table.integer('day_off').defaultTo(0);
      table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
