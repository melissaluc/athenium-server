// db.js

const knexConfig = require("./knexfile.js");


// Determine the environment
// const environment = 'development';
// const environment = 'staging';
const environment = 'production';
const config = knexConfig[environment];

// Initialize Knex connection
const knex = require('knex')(config);

module.exports = knex;
