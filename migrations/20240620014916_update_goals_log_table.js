/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .dropTableIfExists('goals_log') // Drop table if it exists
        .then(() => {
            return knex.schema.createTable('goals_log', function(table) {
                table.uuid('uid').primary();
                table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE');
                table.string('status').notNullable();
                table.string('goal_name').notNullable();
                table.timestamp('start_date').notNullable();
                table.timestamp('achieved_on');
                table.string('description').notNullable();
                table.string('category').notNullable();
                table.string('metric').notNullable();
                table.string('uom').notNullable();
                table.float('current_value');
                table.float('start_value').notNullable(); // Added start_value column
                table.float('target_value').notNullable(); // Added target_value column
                table.float('priority_level').notNullable();
                table.integer('rank').notNullable();
                table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
                table.timestamp('updated_on').defaultTo(knex.fn.now()).notNullable();
            });
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('goals_log') // Drop table if it exists
        .then(() => {
            return knex.schema.createTable('goals_log', (table) => {
                table.uuid('uid').primary();
                table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE');
                table.string('status').notNullable();
                table.string('goal_name').notNullable();
                table.timestamp('start_date').notNullable();
                table.timestamp('achieved_on');
                table.string('description').notNullable();
                table.string('category').notNullable();
                table.string('metric').notNullable();
                table.string('uom').notNullable();
                table.float('current_value').notNullable(); // Ensure current_value is not nullable
                table.float('start_value').notNullable(); // Ensure start_value is not nullable
                table.float('target_value').notNullable();
                table.float('priority_level').notNullable();
                table.integer('rank').notNullable();
                table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
                table.timestamp('updated_on').defaultTo(knex.fn.now()).notNullable();
            });
        });
};
