const workoutModel = require('../models/workoutModel.js');


const getWorkoutsByUserId = async (id) => {
    return workoutModel.getWorkoutsByUserId(id);
};

const createWorkout = async (userId, workout) => {
    return workoutModel.createWorkout(userId, workout);
};

const updateByUserId = async (id, dateSelected, measurements) => {
    return workoutModel.updateUser(id, dateSelected, measurements);
};

const deleteWorkout = async (id, dateSelected, measurements) => {
    return workoutModel.deleteWorkout(id, dateSelected, measurements);
};


module.exports = {
    getWorkoutsByUserId,
    createWorkout,
    updateByUserId,
    deleteWorkout
};
