const { table } = require("../config/database");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('san_phams',(table)=>{
        table.increments('id').primary();
        table.string('ten_san_pham').notNullable();
        table.string('slug_san_pham').notNullable();
        table.string('hinh_anh');
        table.date('han_su_dung').notNullable();
        table.integer('so_luong').defaultTo(0);
        table.integer('id_don_vi').defaultTo(0);
        table.decimal('gia_nhap').defaultTo(0);
        table.decimal('gia_ban').defaultTo(0);
        table.integer('id_danh_muc').defaultTo(0);
        table.string('ghi_chu').defaultTo(0);
        table.timestamps(true, true); 
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('san_phams');
};
