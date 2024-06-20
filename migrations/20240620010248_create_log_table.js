/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('log', function(table) {
            table.uuid('uid').primary();
            table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE');
            table.string('item_id').notNullable();
            table.string('item_name').notNullable();
            table.string('uom').notNullable();
            table.float('value').notNullable();
            table.timestamp('updated_on').defaultTo(knex.fn.now()).notNullable();
            table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('log')
};
