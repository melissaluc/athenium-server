const userModel = require('../models/userModel');


const getUser = async (userId) => {
    return userModel.getUser(userId);
};



module.exports = {
    getUser,
};
