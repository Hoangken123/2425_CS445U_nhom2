exports.up = function (knex) {
    return knex.schema.createTable('don_nhaps', function (table) {
      table.increments('id').primary(); 
      table.string('ma_nhap_kho').notNullable(); 
      table.decimal('thue', 10, 2).notNullable();
      table.integer('id_user').unsigned().notNullable();
      table.decimal('tong_tien', 10, 2).notNullable(); 
      table.integer('so_luong').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now()); 
      table.timestamp('updated_at').defaultTo(knex.fn.now()); 
  
      // Quan hệ với bảng `users`
      table.foreign('id_user').references('users.id').onDelete('CASCADE');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('don_nhaps');
  };
  