// models/measurementModel.js
const config = require("../knexfile.js");
const { error, timeStamp } = require("console");
const knex = require("knex")(config.development);

const { v4: uuidv4 } = require('uuid');

const getGoalsByUserId = async (userId) => {
    try {
        const goals = await knex("goals_log")
            .select(
                "uid",
                "user_id",
                "status",
                "goal_name",
                knex.raw("EXTRACT(epoch FROM start_date)::int AS start_date"),
                knex.raw("EXTRACT(epoch FROM achieved_on)::int AS achieved_on"),
                "description",
                "category",
                "metric",
                "uom",
                "current_value",
                "start_value",
                "target_value",
                "priority_level",
                "rank",
                knex.raw("EXTRACT(epoch FROM created_on)::int AS created_on"),
                knex.raw("EXTRACT(epoch FROM updated_on)::int AS updated_on")
                        )
          .where({ user_id: userId })

            return goals;
            
    } catch (err) {
        console.error('Error fetching meals:', err);
        throw err;
    }
}

const addFood= async (userId, datetimestamp, meal_name, food) => {
    const {food_name, protein, carbs, fat, calories, quantity, uom} = food
    try {

        const id = uuidv4();

        // // Convert Unix timestamp (seconds) to ISO 8601 string
        const planned_on = new Date(datetimestamp * 1000).toISOString().split('T')[0];

        // Insert new measurement with previous values
        const insertedFood = await knex('meals_log')
            .insert({
                uid:id,
                user_id: userId,
                meal_name,
                planned_on,
                food_name,
                protein,
                carbs,
                fat,
                calories,
                quantity,
                uom,
                created_on: knex.fn.now(),
                updated_on: knex.fn.now(),
            })
            .returning('*');

        return insertedFood;
    } catch (error) {
        console.error('Error logging food:', error);
        throw error; // Rethrow the error to handle it further up the chain
    }
};

const updateUser = (userId, dateSelected, measurement) => {

    measurement.updated_on = new Date().toISOString();

    return knex('measurements_log')
        .where({ user_id: userId })
        .andWhere({ created_on: dateSelected })
        .update(measurement)
        .returning('*');
};

module.exports = {
    getGoalsByUserId,
    addFood,
    updateUser
};