// db.js

const knex = require('knex');
const knexConfig = require('./knexfile');

// Determine the environment
// const environment = 'development';
// const environment = 'staging';
const environment = 'production';
const config = knexConfig[environment];

// Initialize Knex connection
const db = knex(config);

module.exports = db;
