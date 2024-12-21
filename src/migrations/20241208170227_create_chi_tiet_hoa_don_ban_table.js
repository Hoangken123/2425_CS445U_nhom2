/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('chi_tiet_hoa_don_ban',(table)=>{
        table.increments('id').primary();
        table.integer('id_hoa_don').notNullable();
        table.text('ten_san_pham').notNullable();
        table.decimal('gia_ban').notNullable();
        table.integer('so_luong').notNullable();
        table.text('DVT').nullable();
        table.integer('trang_thai').defaultTo(0);
        table.decimal('thanh_tien',15,2).notNullable();
        table.text('ghi_chu').nullable()
        table.timestamps(true, true); 
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('chi_tiet_hoa_don_ban');

};
