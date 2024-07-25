
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
        table.string('abbreviation', 10).notNullable();
        table.string('uom', 10).notNullable();
        table.string('description', 255);
        table.primary(['user_id', 'uom_name']);
        crea
      });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('user_uom');
};
