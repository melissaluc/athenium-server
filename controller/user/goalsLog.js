const fs = require("fs");

const config = require("../../knexfile.js");
const { error } = require("console");
const knex = require("knex")(config);

const { v4: uuidv4 } = require('uuid');


async function queryUserGoalsLog(user_id) {
    try{
        knex
        .select(
            "uid",
            "user_id",
            "status",
            "goal_name",
            "dt_start",
            "dt_end",
            "description",
            "category",
            "metric",
            "metric_units",
            "metric_value",
            "priority_level",
            "rank",
            "created_on",
            "updated_on"
        )
        .from("goals_log")
        .where("user_id","=",user_id)
        
        return rows
    
    } catch (err) {
        console.log(err)
        throw err
    }

}


module.exports = {
    queryUserGoalsLog
}
