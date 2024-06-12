
const fs = require("fs");

const config = require("../../knexfile.js");
const { error } = require("console");
const knex = require("knex")(config);

const { v4: uuidv4 } = require('uuid');


async function queryUserWorkoutsLog(user_id) {
  try{
    const rows = await knex.select(
        "uid",
        "user_id",
        "workout_name",
        "exercise_name",
        "dt_planned",
        "status",
        "weight_kg",
        "reps",
        "order",
        "created_on",
        "updated_on"
    )
    .from("workouts_log")
    .where("user_id","=",user_id)
    return rows
    

  } catch (error) {
      throw error
  }

}


module.exports = {
  queryUserWorkoutsLog
}
