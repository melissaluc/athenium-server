const workoutModel = require('../models/workoutModel.js');


const getWorkoutsByUserId = async (userId) => {
    return workoutModel.getWorkouts(userId);
};

const getWorkout = async (userId,workoutId) => {
    return workoutModel.getWorkouts(userId, workoutId);
};



const createWorkout = async (userId, workout) => {
    return workoutModel.createWorkout(userId, workout);
};

const updateWorkout = async (userId, workoutId, updateData) => {

    return workoutModel.updateWorkout(userId, workoutId, updateData);

};

const deleteWorkout = async (userId, workoutId) => {
    return workoutModel.deleteWorkout(userId, workoutId);
};



module.exports = {
    getWorkoutsByUserId,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkout,
    
};
