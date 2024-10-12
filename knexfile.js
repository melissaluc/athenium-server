
require('dotenv').config();
const path = require('path');
const {s3EnvVars} = require('./utils/aws.js')
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */


module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: s3EnvVars?.DEV_DB_NAME,
      user: s3EnvVars?.DEV_DB_USER,
      password: s3EnvVars?.DEV_DB_PASSWORD,
      host: s3EnvVars?.DEV_DB_HOST,
      port: s3EnvVars?.DEV_DB_PORT
    }
  },
  staging: {
    client: 'pg',
    connection: {
      database: s3EnvVars?.STAGING_DB_NAME,
      user: s3EnvVars?.STAGING_DB_USER,
      password: s3EnvVars?.STAGING_DB_PASSWORD
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
    // client: 'pg',
    client: 'cockroachdb',
    connection: {
      connectionString:s3EnvVars?.DATABASE_URL,
      // database: s3EnvVars?.PRODUCTION_DB_NAME,
      // user: s3EnvVars?.PRODUCTION_DB_USER,
      // password: s3EnvVars?.PRODUCTION_DB_PASSWORD,
      // host: s3EnvVars?.PRODUCTION_DB_HOST,
      // port: s3EnvVars?.PRODUCTION_DB_PORT,
      charset: "utf8",
      // ssl: { rejectUnauthorized: false } for render.com
      ssl: {
        rejectUnauthorized: false,  // change to true 
        ca: path.join(__dirname, 'certs', 'root.crt').toString()
      }
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
