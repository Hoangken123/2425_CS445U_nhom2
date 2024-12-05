const { table } = require("../config/database");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('hoa_don_ban',(table)=>{
    table.increments('id').primary();
    table.integer('id_cua_hang').defaultTo(0);
    table.integer('id_khach_hang').nullable();
    table.decimal('tong_tien',15,2).notNullable();
    table.integer('trang_thai').defaultTo(0);
    table.date('ngay_ban').notNullable();
    table.text('ghi_chu').nullable()
    table.timestamps(true, true); 
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('hoa_don_ban');

};
