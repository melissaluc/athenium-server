const dashboardModel = require('../models/dashboardModel');


const getByUserId = async (id) => {
    return dashboardModel.getBodyCompositionByUserId(id);
};



module.exports = {
    getByUserId,

};
