/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('measurements_log', function(table) {
        table.dropColumns(['weight_kg','musclemass_kg','bf_percentage'])
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
*/
exports.down = function(knex) {
    return knex.schema.table('measurements_log', function(table) {
        table.double('weight_kg').notNullable();
        table.double('musclemass_kg').notNullable();
        table.double('bf_percentage').notNullable();
    })
  
};
