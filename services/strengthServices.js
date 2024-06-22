const strengthModel = require('../models/strengthModel.js');


const getStrengthByUserId = async (userId) => {
    return strengthModel.getStrengthRecords(userId);
};



const createStrength = async (userId, data) => {
    return strengthModel.createStrengthRecord(userId, data);
};



module.exports = {
    getStrengthByUserId,
    createStrength,
    
};
