const bodyCompositionService = require('../services/bodyCompositionService');

const addBodyComposition = async (req, res) => {
    console.log(req.body)
    try {
        const newBodyComposition = req.body;
        const userId = req.user.userId;
        const bodyComposition= await bodyCompositionService.addNewRecord(userId, newBodyComposition);
        res.status(201).json(bodyComposition);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    addBodyComposition
};