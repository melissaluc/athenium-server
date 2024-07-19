const knex = require('knex');
const knexConfig = require('./knexfile');

// development production staging

const config = knexConfig[process.env.NODE_ENV];

// Initialize Knex connection with logging enabled
const knexInstance = knex({
  ...config,
  debug: true,  
});

module.exports = knexInstance;