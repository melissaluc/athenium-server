const strengthService = require('../services/strengthServices');

const getStrengthByUserId = async (req,res) => {
    try {
        const userId = req.user.userId; 
        const strength = await strengthService.getStrengthByUserId(userId);
        res.status(200).json(strength);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const createStrength = async (req, res) => {

    try {
        const data = req.body;
        const userId = req.user.userId;
        const strength= await strengthService.createStrength(userId, data);
        res.status(201).json(strength);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getExerciseStrengthLogByUserId = async (req, res) => {
    try {
        const {exerciseName} = req.params
        const userId = req.user.userId;
        const log = await strengthService.getExerciseStrengthLogByUserId(userId, exerciseName)
        res.status(200).json(log);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

const deleteStrengthRecords = async (req, res) => {

    try {
        const {exerciseName} = req.params
        const userId = req.user.userId;
        // const formatExerciseName = exerciseName.replace('-'," ")
        const deletedExercise = await strengthService.deleteStrengthRecords(userId, exerciseName)
        console.log(deletedExercise)
        res.status(200).json(deletedExercise);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

const updateStrengthRecords = async (req, res) => {
    console.log('Patch Request')
    try {
        const {exerciseName} = req.params
        const userId = req.user.userId;
        const updatedData = req.body
        console.log('exerciseName: ', exerciseName)
        // const formatExerciseName = exerciseName.replace('-'," ")
        const updatedLogs = await strengthService.updateStrengthRecords(userId,  exerciseName, updatedData)
        console.log('response to client: ', updatedLogs)
        res.status(200).json(updatedLogs);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}


module.exports = {
    getStrengthByUserId,
    createStrength,
    getExerciseStrengthLogByUserId,
    deleteStrengthRecords,
    updateStrengthRecords
};