/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('measurements_log', (table) => {
        table.uuid('uid').primary();
        table.uuid('user_id').references('user_id').inTable('users');
        table.double('weight_kg').notNullable();
        table.double('musclemass_kg').notNullable();
        table.double('bf_percentage').notNullable();
        table.double('neck_cm').notNullable();
        table.double('shoulder_cm').notNullable();
        table.double('chest_cm').notNullable();
        table.double('abdomen_cm').notNullable();
        table.double('waist_cm').notNullable(); 
        table.double('hip_cm').notNullable();
        table.double('r_bicep_cm').notNullable();
        table.double('l_bicep_cm').notNullable();
        table.double('r_thigh_cm').notNullable();
        table.double('l_thigh_cm').notNullable();
        table.double('r_calf_cm').notNullable(); 
        table.double('l_calf_cm').notNullable();
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
    return knex.schema.dropTable('measurements_log');
};
