exports.up = function (knex) {
  return knex.schema.createTable('danh_muc', (table) => {
      table.increments('id').primary(); // ID tự tăng
      table.string('ten').notNullable(); // Tên danh mục (bắt buộc)
      table.text('mo_ta').nullable(); // Mô tả danh mục (tùy chọn)
      table.timestamps(true, true); // created_at và updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('danh_muc');
};
