/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user_verification', (table) => {
        table.uuid('user_id').primary();
        table.string('code', 10).notNullable();
        table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('expires_at').defaultTo(knex.fn.now()).notNullable();
        // table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('user_verification');
};
