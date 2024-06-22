/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .dropTableIfExists('strength_log') // Drop the table if it exists
        .createTable('strength_log', function(table) {
            table.uuid('uid').primary();
            table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE');
            table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
            table.timestamp('calculated_on').notNullable();
            table.string('exercise_name').notNullable();
            table.string('category').notNullable();
            table.float('body_weight').notNullable();
            table.float('relative_strength_demographic');
            table.float('one_rep_max');
            table.float('lift');
            table.string('strength_level');
            table.string('next_strength_level'); // Nullable for initial creation
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('strength_log');
};
