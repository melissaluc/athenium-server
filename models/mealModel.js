const db = require('../db');

const { v4: uuidv4 } = require('uuid');

const getMealsByUserId = async (userId) => {
    try {
        const meals = await knex('meals_log')
            .select(
                "uid",
                "user_id",
                "planned_on",
                "updated_on",
                "meal_name",
                "food_name",
                "quantity",
                "uom",
                "calories",
                "protein",
                "carbs",
                "fat",
                "created_on",
                
                
                // knex.raw("EXTRACT(epoch FROM created_on)::int AS created_on_unix"),
                // knex.raw("EXTRACT(epoch FROM updated_on)::int AS updated_on_unix")
            )
            .where({ user_id: userId })
            .orderBy('planned_on', 'desc');
            let returnData = [];
            let currentIndex = 0;
            meals.forEach(meal=>{
                const {uid, food_name, quantity, protein, carbs, fat, calories, meal_name, planned_on, uom } = meal;
                const timestamp = Math.floor(new Date(planned_on).getTime() / 1000);
                const existingIndex = returnData.findIndex(template => template.datetimestamp === timestamp);
                console.log(existingIndex)
            if (existingIndex === -1) {
                // Create a new data template if not found
                returnData.push({
                    datetimestamp: timestamp,
                    meals: {
                        [meal_name]: [{
                            uid,
                            food_name,
                            quantity,
                            uom,
                            protein,
                            carbs,
                            fat,
                            calories
                        }]
                    },
                    totals: {
                        macros_cal: {
                            protein: protein,
                            carbs: carbs,
                            fat: fat
                        },
                        macros_g: {
                            protein: protein,
                            carbs: carbs,
                            fat: fat
                        }
                    }
                });
                // Update current index
                currentIndex++;
            } else {
                // Add the meal to existing data template
                if (!returnData[existingIndex].meals[meal_name]) {
                    returnData[existingIndex].meals[meal_name] = [];
                }
                returnData[existingIndex].meals[meal_name].push({
                    uid,
                    food_name,
                    quantity,
                    uom,
                    protein,
                    carbs,
                    fat,
                    calories
                });

                // Update totals for existing data template
                returnData[existingIndex].totals.macros_cal.protein += protein;
                returnData[existingIndex].totals.macros_cal.carbs += carbs;
                returnData[existingIndex].totals.macros_cal.fat += fat;

                returnData[existingIndex].totals.macros_g.protein += protein;
                returnData[existingIndex].totals.macros_g.carbs += carbs;
                returnData[existingIndex].totals.macros_g.fat += fat;
            }


            })
            return returnData;
            
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
    getMealsByUserId,
    addFood,
    updateUser
};