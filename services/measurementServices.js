const measurementModel = require('../models/measurementModel');


const getByUserId = async (id) => {
    return measurementModel.getMeasurementsByUserId(id);
};

const createMeasurementByUser = async (userId, dateSelected, measurements) => {
    return measurementModel.createMeasurement(userId, dateSelected, measurements);
};

const updateByUserId = async (id, dateSelected, measurements) => {
    return measurementModel.updateUser(id, dateSelected, measurements);
};



module.exports = {
    getByUserId,
    createMeasurementByUser,
    updateByUserId,
};
