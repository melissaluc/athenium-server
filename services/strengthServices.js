const strengthModel = require('../models/strengthModel.js');


const getStrengthByUserId = async (userId) => {
    return strengthModel.getStrengthRecords(userId);
};



const createStrength = async (userId, data) => {
    return strengthModel.createStrengthRecord(userId, data);
};

const getExerciseStrengthLogByUserId = async (userId, exerciseName) => {
    return strengthModel.getExerciseRecords(userId, exerciseName)
}

const deleteStrengthRecords = async (userId, exerciseName) => {
    return strengthModel.deleteExerciseStrengthRecords(userId, exerciseName)
}


const updateStrengthRecords = async (userId, exerciseName, updatedData) => {
    return strengthModel.updateStrengthRecords(userId, exerciseName, updatedData)
}



module.exports = {
    getStrengthByUserId,
    createStrength,
    getExerciseStrengthLogByUserId,
    deleteStrengthRecords,
    updateStrengthRecords
    
};
