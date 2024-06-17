const workoutModel = require('../models/workoutModel.js');


const getWorkoutsByUserId = async (userId) => {
    return workoutModel.getWorkoutsByUserId(userId);
};

const createWorkout = async (userId, workout) => {
    return workoutModel.createWorkout(userId, workout);
};

const updateWorkout = async (userId, workout) => {

    return workoutModel.updateWorkout(userId,workout);

};

const deleteWorkout = async (userId, workoutId) => {
    return workoutModel.deleteWorkout(userId, workoutId);
};


module.exports = {
    getWorkoutsByUserId,
    createWorkout,
    updateWorkout,
    deleteWorkout
};
