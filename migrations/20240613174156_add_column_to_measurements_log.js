/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('measurements_log', function(table) {
        table.double('l_upper_thigh_cm').notNullable().defaultTo(0); // Example of adding a new column
        table.double('r_upper_thigh_cm').notNullable().defaultTo(0); // Example of adding a new column
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('measurements_log', function(table) {
        table.dropColumn('l_upper_thigh_cm')
        table.dropColumn('r_upper_thigh_cm');
    });
};
