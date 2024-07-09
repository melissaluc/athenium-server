// models/measurementModel.js
const config = require("../knexfile.js");
const { error, timeStamp } = require("console");
const knex = require("knex")(config.development);

const { v4: uuidv4 } = require('uuid');

const getUser = async (username) => {
    try {
        const user= await knex('users')
            .select(
                "user_id",
                "dob",
                "first_name",
                "last_name"
            )
            .where({username})

     
            return user;
            
    } catch (err) {
        console.error('Error fetching meals:', err);
        throw err;
    }
}

const addUser= async (userId, datetimestamp, meal_name, food) => {
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
    getMealsByUserId,
    addFood,
    updateUser
};