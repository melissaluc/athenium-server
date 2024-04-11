/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('nutrition_log', (table) => { 
        table.uuid('uid').primary();
        table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE');
        table.string('status').notNullable();
        table.string('meal').notNullable();
        table.string('food_name').notNullable();
        table.timestamp('dt_planned').notNullable();
        table.string('notes').notNullable();
        table.double('calories').notNullable();
        table.string('serving_units').notNullable();
        table.double('serving').notNullable();
        table.double('protein_g').notNullable();
        table.double('carbs_g').notNullable();
        table.double('fat_g').notNullable();
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
    return knex.schema.alterTable('nutrition_log', function(table) {
      table.dropForeign(['user_id']);

    });
  };