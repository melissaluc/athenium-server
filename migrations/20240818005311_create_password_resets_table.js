/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('password_reset', (table) => {
                table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE');
                table.string('token', 200).notNullable();
                table.string('email_address', 200).notNullable();
                table.string('action', 200).notNullable();
                table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
                table.timestamp('expires_at').notNullable();
            });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('password_reset');
};
