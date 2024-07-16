const strengthService = require('../services/strengthServices');

const getStrengthByUserId = async (req,res) => {
    try {
        const { userId} = req.params; 
        const strength = await strengthService.getStrengthByUserId(userId);
        res.json(strength);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const createStrength = async (req, res) => {

    try {
        const data = req.body;
        const {userId} = req.params
        const strength= await strengthService.createStrength(userId, data);
        res.status(201).json(strength);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




module.exports = {
    getStrengthByUserId,
    createStrength,

};