const trendsModel = require('../models/trendsModel');


const getByUserId = async (id) => {
    return trendsModel.getTrendsByUserId(id);
};

module.exports = {
    getByUserId,
};
