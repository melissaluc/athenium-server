
require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: process.env.DEV_DB_NAME,
      user: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASSWORD,
      host: process.env.DEV_DB_HOST,
      port: process.env.DEV_DB_PORT
    }
  },
  staging: {
    client: 'pg',
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
    client: 'pg',
    connection: {
      database: process.env.PRODUCTION_DB_NAME,
      user: process.env.PRODUCTION_DB_USER,
      password: process.env.PRODUCTION_DB_PASSWORD,
      host: process.env.PRODUCTION_DB_HOST,
      port: process.env.PRODUCTION_DB_PORT
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
