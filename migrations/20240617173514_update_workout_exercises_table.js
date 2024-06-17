/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('workout_exercises', (table) => {
        table.renameColumn('muscle_group', 'group');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('workout_exercises', (table) => {
        table.renameColumn('group', 'muscle_group');
    });
};
