const goalModel = require('../models/goalModel');


const getByUserId = async (id) => {
    return goalModel.getGoalsByUserId(id);
};

const addGoal = async (userId, newGoal) => {
    return goalModel.addGoal(userId, newGoal);
};

const updateGoal = async (userId, goalId, updatedGoal) => {
    return goalModel.putGoalById(userId, goalId, updatedGoal);
};

const deleteGoal= async (userId,goalId) => {
    return goalModel.deleteGoal(userId,goalId);
};



module.exports = {
    getByUserId,
    addGoal,
    updateGoal,
    deleteGoal
};
