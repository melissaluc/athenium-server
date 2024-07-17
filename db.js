const knex = require('knex');
const knexConfig = require('./knexfile');

// development production staging
const environment = 'production'; 
const config = knexConfig[environment];

// Initialize Knex connection with logging enabled
const knexInstance = knex({
  ...config,
  debug: true,  
});

module.exports = knexInstance;