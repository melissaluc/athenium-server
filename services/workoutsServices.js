const workoutModel = require('../models/workoutModel.js');


const getWorkoutsByUserId = async (id) => {
    return workoutModel.getWorkoutsByUserId(id);
};

const createWorkout = async (userId, workout) => {
    return workoutModel.createWorkout(userId, workout);
};

const updateWorkout = async (id, workout) => {
        
    return workoutModel.updateWorkout(id,workout);

};

const deleteWorkout = async (id, dateSelected, measurements) => {
    return workoutModel.deleteWorkout(id, dateSelected, measurements);
};


module.exports = {
    getWorkoutsByUserId,
    createWorkout,
    updateWorkout,
    deleteWorkout
};
