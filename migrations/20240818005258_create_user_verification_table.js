/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user_verification', (table) => {
                table.uuid('user_id').primary()
                table.string('code', 10).notNullable();
                table.string('email_address', 200).notNullable();
                table.string('action', 200).notNullable();
                table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
                table.timestamp('expires_at').notNullable();
                table.jsonb('user_data');
            });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_verification');
};
