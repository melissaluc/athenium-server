// models/userModel.js
const userService = require('../services/userServices');


const getUser = async (req,res) => {
    
    try {
        const userId = req.user.userId;
        const users = await userService.getUser(userId);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



module.exports = {
    getUser,

};