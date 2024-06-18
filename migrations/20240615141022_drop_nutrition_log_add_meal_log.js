/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .dropTableIfExists('nutrition_log')
        .createTable('meals_log', function(table) {
            table.uuid('meal_id').primary();
            table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE');
            table.timestamp('planned_on').notNullable();
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

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('meals_log')
        .createTable('nutrition_log', function(table) {
            table.uuid('uid').primary();
            table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE');
            table.string('status').notNullable();
            table.string('meal').notNullable();
            table.string('food_name').notNullable();
            table.timestamp('dt_planned').notNullable();
            table.string('notes').notNullable();
            table.double('calories').notNullable();
            table.string('serving_units').notNullable();
            table.double('serving').notNullable();
            table.double('protein_g').notNullable();
            table.double('carbs_g').notNullable();
            table.double('fat_g').notNullable();
            table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
            table.timestamp('updated_on').defaultTo(knex.fn.now()).notNullable();
        });
};
