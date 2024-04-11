//  return logs for the given user

const express = require("express");
const router = express.Router();
const fs = require("fs");

const config = require("../knexfile.js");
const { error } = require("console");
const knex = require("knex")(config);

const { v4: uuidv4 } = require('uuid');

