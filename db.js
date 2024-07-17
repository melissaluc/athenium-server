const knex = require('knex');
const knexConfig = require('./knexfile');

// development production staging
const environment = 'production'
const config = knexConfig[environment];

const knexInstance = knex(config);

module.exports = knexInstance;
