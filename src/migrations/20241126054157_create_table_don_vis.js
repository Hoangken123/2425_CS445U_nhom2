/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('don_vis', (table) => {
        table.increments('id').primary();
        table.string('ten_don_vi').notNullable(); 
        table.string('slug_don_vi').nullable();
        table.timestamps(true, true); 
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('don_vis');
};
