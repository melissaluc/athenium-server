const knex = require('knex');
const knexConfig = require('../knexfile');
const {s3EnvVars} = require('../utils/aws')
// development production staging

const config = knexConfig[s3EnvVars?.NODE_ENV];

// Initialize Knex connection with logging enabled
const knexInstance = knex({
  ...config,
  debug: true,  
});

module.exports = knexInstance;