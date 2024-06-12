const measurementModel = require('../models/measurementModel');


const getByUserId = async (id) => {
    return measurementModel.getMeasurementsByUserId(id);
};

const createUser = async (user) => {
    return measurementModel.createUser(user);
};

const updateByUserId = async (id, dateSelected, measurements) => {
    return measurementModel.updateUser(id, dateSelected, measurements);
};



module.exports = {
    getByUserId,
    createUser,
    updateByUserId,
};
