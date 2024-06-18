
const { v4: uuidv4 } = require('uuid');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user_uom', (table) => {
        table.uuid('uid').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('user_id').primary();
        table.string('uom_name', 50).notNullable();
        table.string('abbreviation', 10).notNullable();
        table.string('description', 255);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('user_uom');
};
