/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
        table.uuid('user_id').primary();
        table.string('username').notNullable();
        table.string('email_address').notNullable();
        table.string('password').notNullable();
        table.date('dob').notNullable();
        table.string('google_id').notNullable();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('weight_units').notNullable();
        table.string('length_units').notNullable();
        table.double('height_cm').notNullable();
        table.double('leg_cm').notNullable();
        table.double('torso_cm').notNullable();
        table.string('country').notNullable();
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
    return knex.schema.dropTable('users');
};
