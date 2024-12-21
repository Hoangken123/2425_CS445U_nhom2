/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('forget_passwords',(table) => {
        table.increments('id').primary();
        table.integer('user_id').notNullable();
        table.string('token').notNullable();
        table.dateTime('expires_at').notNullable();
        table.timestamps(true, true); 
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('forget_passwords');

};
