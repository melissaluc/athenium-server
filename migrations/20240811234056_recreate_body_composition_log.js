/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.dropTableIfExists('body_composition_log')
        .then(function() {
            return knex.schema.createTable('body_composition_log', function(table) {
        table.uuid('id').primary();
        table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE');
        table.float('weight').notNullable();
        table.float('body_fat').notNullable();
        table.float('lean_muscle_mass').notNullable();
        table.float('bmi').notNullable();
        table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_on').defaultTo(knex.fn.now()).notNullable();
    }); 
})
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('body_composition_log');
};
