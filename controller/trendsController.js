const trendsService = require('../services/trendsServices.js');

const getTrendsByUserId = async (req,res) => {
    try {
        const userId = req.user.userId;
        const trends = await trendsService.getByUserId(userId);
        res.json(trends);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getTrendsByUserId
};