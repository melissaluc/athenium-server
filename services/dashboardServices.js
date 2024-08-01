const dashboardModel = require('../models/dashboardModel');


const getByUserId = async (userId) => {
    return dashboardModel.getBodyCompositionByUserId(userId);
};



module.exports = {
    getByUserId,

};
