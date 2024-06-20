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

const updateMeal = async (req, res) => {
    try {
        const { userId } = req.params;
        const { dateSelected, newMeals } = req.body;
        // Convert UNIX timestamp to ISO 8601 format
        // const dateSelectedConverted = new Date(dateSelected * 1000).toISOString();
        
        const goals = await goalService.updateByUserId(userId, dateSelected, newMeals);
        res.json(goals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const addFoodMeal = async (req, res) => {
    console.log(req.body)
    try {
        const {datetimestamp, goal_name, data:food} = req.body;
        const {userId} = req.params
        const goal= await goalService.addFoodByUser(userId, datetimestamp, goal_name, food);
        res.status(201).json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getByUserId,
    addFoodMeal,
    updateMeal
};