const mealModel = require('../models/mealModel');


const getByUserId = async (id) => {
    return mealModel.getMealsByUserId(id);
};

const addFoodByUser = async (userId, datetimestamp, meal_name, food) => {
    return mealModel.addFood(userId, datetimestamp, meal_name, food);
};

const updateByUserId = async (id, dateSelected, meals) => {
    return mealModel.updateUser(id, dateSelected, meals);
};



module.exports = {
    getByUserId,
    addFoodByUser,
    updateByUserId,
};
