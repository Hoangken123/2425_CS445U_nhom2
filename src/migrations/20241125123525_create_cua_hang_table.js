const { table } = require("../config/database");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('cua_hangs',(table)=>{
        table.increments('id').primary();
        table.string('ten_cua_hang').notNullable();
        table.string('slug_cua_hang').notNullable();
        table.string('dia_chi').notNullable();
        table.timestamps(true, true); 
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('cua_hangs');

};
