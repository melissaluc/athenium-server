// models/userModel.js
const userService = require('../services/userServices');


const getUser = async (req,res) => {
    
    try {
        const userId = req.user.userId;
        const users = await userService.getUser(userId);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


const updateUser= async (req,res) => {
    try {
        const userId = req.user.userId;
        const newUserData = req.body
        const users = await userService.updateUser(userId, newUserData);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



module.exports = {
    getUser,
    updateUser
};