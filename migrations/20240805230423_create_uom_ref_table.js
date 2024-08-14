/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('uom', (table) => {
        table.uuid('uid').primary();
        table.string('uom_name', 50).notNullable();
        table.string('abbreviation', 30).notNullable();
        table.string('description', 255);
        table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_on').defaultTo(knex.fn.now()).notNullable();
        // table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
