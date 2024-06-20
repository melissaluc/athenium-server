// models/goalModel.js
const goalService = require('../services/goalsServices');

const getByUserId = async (req,res) => {
    try {
        const { userId } = req.params; 
        const goals = await goalService.getByUserId(userId);
        res.json(goals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateGoal = async (req, res) => {
    try {
        const { userId, goalId } = req.params;
        const updatedGoal = req.body;
        // Convert UNIX timestamp to ISO 8601 format
        // const dateSelectedConverted = new Date(dateSelected * 1000).toISOString();
        
        const goals = await goalService.updateGoal(userId, goalId, updatedGoal);
        res.json(goals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const addGoal= async (req, res) => {
    try {
        const newGoal = req.body;
        console.log('addgoal',newGoal)
        const {userId} = req.params
        const goal= await goalService.addGoal(userId, newGoal);
        res.status(201).json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteGoal = async (req, res) => {
    try {
        const {userId,goalId} = req.params
        const goal= await goalService.deleteGoal(userId,goalId);
        res.status(201).json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getByUserId,
    addGoal,
    updateGoal,
    deleteGoal
};