/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('workouts_log', (table) => {
        table.uuid('uid').primary();
        table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE');
        table.string('workout_name').notNullable();
        table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_on').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('last_completed');
        table.text('description');
        table.json('tags');
        table.integer('frequency');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('workouts_log');
};
