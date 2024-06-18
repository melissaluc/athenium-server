/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('workout_exercises', (table) => {
        table.uuid('uid').primary();
        table.uuid('workout_id').references('uid').inTable('workouts_log').onDelete('CASCADE');
        table.string('exercise_name').notNullable();
        table.string('category').notNullable();
        table.string('muscle_group'); 
        table.double('weight').nullable();
        table.integer('reps').nullable();
        table.integer('sets').nullable();
        table.integer('duration').nullable(); 
        table.integer('distance').nullable(); 
        table.string('img_url').nullable();
        table.integer('order').notNullable();
        table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_on').defaultTo(knex.fn.now()).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('workout_exercises');
};
