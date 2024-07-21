// models/userModel.js
const userService = require('../services/userServices');

const getUser = async (req,res) => {
    try {
        const {username} = req.params; 

        const users = await userService.getUser(username);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



module.exports = {
    getUser,

};