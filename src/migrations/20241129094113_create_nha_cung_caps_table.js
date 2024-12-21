/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('nha_cung_caps',(table)=>{
      table.increments('id').primary();
      table.string('ten_nha_cung_cap').notNullable();
      table.string('dia_chi').notNullable();
      table.string('so_dien_thoai').notNullable();
      table.string('email').notNullable();
      table.integer('id_cua_hang').unsigned().nullable();
      table.timestamps(true, true); 
  })
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = function(knex) {
  return knex.schema.dropTable('nha_cung_caps');
};