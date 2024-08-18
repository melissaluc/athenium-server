
const { v4: uuidv4 } = require('uuid');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .dropTableIfExists('user_uom')
        .createTable('user_uom', (table) => {
        table.uuid('user_id').notNullable();
        table.string('uom_name', 50).notNullable();
        table.string('abbreviation', 30).notNullable();
        table.string('uom', 20).notNullable();
        table.string('description', 255);
        table.primary(['user_id', 'uom_name']);
        table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_on').defaultTo(knex.fn.now()).notNullable();
      });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('user_uom');
};
