/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .dropTableIfExists('meals_log')
        .createTable('meals_log', function(table) {
            table.uuid('uid').primary();
            table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE');
            table.string('meal_name').notNullable();
            table.date('planned_on').notNullable();
            table.timestamp('updated_on').defaultTo(knex.fn.now()).notNullable();
            table.string('food_name').notNullable();
            table.float('quantity').notNullable();
            table.float('calories').notNullable();
            table.float('protein').notNullable();
            table.float('carbs').notNullable();
            table.float('fat').notNullable();
            table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('meals_log')
        .createTable('meals_log', function(table) {
            table.uuid('meal_id').primary();
            table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE');
            table.date('planned_on').notNullable();
            table.timestamp('updated_on').defaultTo(knex.fn.now()).notNullable();
            table.string('food_name').notNullable();
            table.float('quantity').notNullable();
            table.float('calories').notNullable();
            table.float('protein').notNullable();
            table.float('carbs').notNullable();
            table.float('fat').notNullable();
            table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
            table.timestamp('deleted_on');
        });
};
