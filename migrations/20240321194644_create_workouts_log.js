/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('workouts_log', (table) => {
        table.uuid('uid').primary();
        table.uuid('user_id').references('user_id').inTable('users');
        table.string('workout_name').notNullable();
        table.string('exercise_name').notNullable(); 
        table.timestamp('dt_planned').notNullable();
        table.string('status').notNullable();
        table.double('weight_kg').notNullable();
        table.double('reps').notNullable();
        table.integer('order').notNullable();
        table.double('strength_level').notNullable();
        table.string('strength_class').notNullable();
        table.double('est_one_rep_max').notNullable();
        table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_on').defaultTo(knex.fn.now()).notNullable();
        // table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('workouts_log');
};
