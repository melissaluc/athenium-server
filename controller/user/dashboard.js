const fs = require("fs");

const config = require("../../knexfile.js");
const { error } = require("console");
const knex = require("knex")(config);

const { v4: uuidv4 } = require('uuid');



const measurementsLog = require("../controller/user/measurementsLog.js")
const userProfile = require("../controller/user/users.js")
const goalsLog = require("../controller/user/goalsLog.js")
const nutritionLog = require("../controller/nutritionLog.js")
const workoutsLog = require("../controller/workoutsLog.js")


// get latest entry
// give strength stats for each muscle group
// show user stats
//  today's nutrtiiton