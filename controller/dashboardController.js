// models/BodyCompositionModel.js
const dashboardService = require('../services/dashboardServices');

const getBodyCompositionByUserId = async (req,res) => {
    try {
        const { userId } = req.params; 
        const bodyComposition = await dashboardService.getByUserId(userId);
        res.json(bodyComposition);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



module.exports = {
    getBodyCompositionByUserId,

};