/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('goals_log', function(table) {
        table.renameColumn('metric_units', 'uom');
        table.renameColumn('metric_value', 'current_value');
        table.renameColumn('dt_start', 'start_date');
        table.dropColumns(['dt_end']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('goals_log', function(table) {
        table.renameColumn('uom', 'metric_units');
        table.renameColumn('current_value', 'metric_value');
        table.renameColumn('start_date', 'dt_start');
        table.timestamp('dt_end').notNullable();
    });
};
