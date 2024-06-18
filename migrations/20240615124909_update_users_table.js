/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('users', function(table) {
        table.dropColumns([
            'weight_units',
            'length_units',
            'height_cm',
            'leg_cm',
            'torso_cm'])
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('users', function(table) {
        table.string('weight_units').notNullable();
        table.string('length_units').notNullable();
        table.double('height_cm').notNullable();
        table.double('leg_cm').notNullable();
        table.double('torso_cm').notNullable();
    }); 
};
