/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('khach_hangs',(table)=>{
        table.increments('id_khach_hang').primary();
        table.string('ten_khach_hang').notNullable();
        table.string('so_dien_thoai').notNullable();
        table.string('email');
        table.integer('tong_mua').notNullable();
        table.integer('dia_chi').defaultTo(0);
        table.timestamps(true, true); 
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('khach_hangs');
};
