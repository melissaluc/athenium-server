const userModel = require('../models/userModel');


const getUser = async (username) => {
    return userModel.getUser(username);
};



module.exports = {
    getUser,
};
