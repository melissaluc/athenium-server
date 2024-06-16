/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('workouts_log', function(table) {
        table.dropColumn('weight_kg');
        table.dropColumn('reps');
        table.dropColumn('order');
        table.dropColumn('strength_level');
        table.dropColumn('strength_class');
        table.dropColumn('est_one_rep_max');
        table.timestamp('last_completed');
        table.text('description');
        table.string('tags');
        table.renameColumn('dt_planned', 'planned_on');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('workouts_log', function(table) {
        table.double('weight_kg').notNullable();
        table.double('reps').notNullable();
        table.integer('order').notNullable();
        table.double('strength_level');
        table.string('strength_class');
        table.double('est_one_rep_max');
        table.dropColumn('last_completed');
        table.dropColumn('description');
        table.dropColumn('tags');
        table.renameColumn('planned_on', 'dt_planned');
    });
};
