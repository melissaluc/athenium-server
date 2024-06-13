
const fs = require("fs");

const config = require("../../knexfile.js");
const { error } = require("console");
const knex = require("knex")(config);

const { v4: uuidv4 } = require('uuid');


async function queryUserNutritionLog(user_id) {
    try{
        const rows = knex.select(
            "uid",
            "user_id",
            "status",
            "meal",
            "food_name",
            "dt_planned",
            "notes",
            "calories",
            "serving_units",
            "serving",
            "protein_g",
            "carbs_g",
            "fat_g",
            "created_on",
            "updated_on"
        )
        .from("nutrition_log")
        .where("user_id","=",user_id)

        return rows

    } catch (err) {
        console.log(err)
        throw err
    }

}


module.exports = {
    queryUserNutritionLog
}
