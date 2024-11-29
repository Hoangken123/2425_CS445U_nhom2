/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('password_reset_tokens',(table) => {
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
    return knex.schema.dropTable('password_reset_tokens');

};
