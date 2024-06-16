const workoutModel = require('../models/workoutModel.js');


const getWorkoutByUserId = async (id) => {
    return workoutModel.getMeasurementsByUserId(id);
};

const createWorkoutByUser = async (userId, dateSelected, measurements) => {
    return workoutModel.createMeasurement(userId, dateSelected, measurements);
};

const updateByUserId = async (id, dateSelected, measurements) => {
    return workoutModel.updateUser(id, dateSelected, measurements);
};

const deleteWorkout = async (id, dateSelected, measurements) => {
    return workoutModel.deleteWorkout(id, dateSelected, measurements);
};


module.exports = {
    getWorkoutByUserId,
    createWorkoutByUser,
    updateByUserId,
    deleteWorkout
};
