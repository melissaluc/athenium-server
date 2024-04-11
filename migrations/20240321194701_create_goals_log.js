/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('goals_log', (table) => { 
        table.uuid('uid').primary();
        table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE');
        table.string('status').notNullable();
        table.string('goal_name').notNullable();
        table.timestamp('dt_start').notNullable();
        table.timestamp('dt_end').notNullable();
        table.string('description').notNullable();
        table.string('category').notNullable();
        table.string('metric').notNullable();
        table.string('metric_units').notNullable();
        table.double('metric_value').notNullable();
        table.double('priority_level').notNullable();
        table.integer('rank').notNullable();
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
    return knex.schema.alterTable('goals_log', function(table) {
      table.dropForeign(['user_id']);
    });
  };