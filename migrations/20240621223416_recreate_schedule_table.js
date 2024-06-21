// Replace the existing content with the following:
exports.up = function(knex) {
    return knex.schema.dropTableIfExists('schedule')
      .then(function() {
        return knex.schema.createTable('schedule', function(table) {
          table.uuid('uid').primary();
          table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE');
          table.string('activity_name').notNullable();
          table.string('activity_category').notNullable();
          table.uuid('activity_id');
          table.enum('activity_type', ['workout', 'meal']).notNullable();
          table.timestamp('planned_time').notNullable();
          table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
          table.timestamp('updated_on').defaultTo(knex.fn.now()).notNullable();
        });
      });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('schedule');
  };
  