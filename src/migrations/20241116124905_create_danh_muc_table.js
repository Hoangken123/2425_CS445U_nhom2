exports.up = function (knex) {
  return knex.schema.createTable('danh_muc', (table) => {
      table.increments('id').primary(); 
      table.string('ten').notNullable(); 
      table.text('mo_ta').nullable(); 
      table.timestamps(true, true); 
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('danh_muc');
};
