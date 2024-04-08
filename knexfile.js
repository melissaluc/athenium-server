// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'athenium_dev_db',
      user:     'postgres',
      password: 'mypassword'
    }
  },
  staging: {
    client: 'postgresql',
    connection: {
      database: process.env.STAGING_DB_NAME,
      user: process.env.STAGING_DB_USER,
      password: process.env.STAGING_DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'postgresql',
    connection: {
      database: process.env.PRODUCTION_DB_NAME,
      user: process.env.PRODUCTION_DB_USER,
      password: process.env.PRODUCTION_DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};