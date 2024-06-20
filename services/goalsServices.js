const goalModel = require('../models/goalModel');


const getByUserId = async (id) => {
    return goalModel.getGoalsByUserId(id);
};

const addFoodByUser = async (userId, datetimestamp, goal_name, goal) => {
    return goalModel.addFood(userId, datetimestamp, goal_name, goal);
};

const updateByUserId = async (id, dateSelected, goals) => {
    return goalModel.updateUser(id, dateSelected, goals);
};



module.exports = {
    getByUserId,
    addFoodByUser,
    updateByUserId,
    // deleteGoal
};
