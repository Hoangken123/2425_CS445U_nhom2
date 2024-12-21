exports.up = function(knex) {
  return knex.schema.createTable('cua_hangs', function(table) {
      table.increments('id').primary();
      table.string('ten_cua_hang').notNullable();
      table.string('slug_cua_hang').notNullable().unique();  
      table.string('dia_chi').notNullable();
      table.timestamps(true, true);  
  });
};
exports.down = function (knex) {
  return knex.schema.dropTable('cua_hangs');
};
