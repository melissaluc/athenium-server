// models/mealModel.js
const mealService = require('../services/mealsServices');

const getMealsByUserId = async (req,res) => {
    try {
        const userId = req.user.userId;
        const meals = await mealService.getByUserId(userId);
        res.json(meals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateMeal = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { dateSelected, newMeals } = req.body;
        // Convert UNIX timestamp to ISO 8601 format
        // const dateSelectedConverted = new Date(dateSelected * 1000).toISOString();
        
        const meals = await mealService.updateByUserId(userId, dateSelected, newMeals);
        res.json(meals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const addFoodMeal = async (req, res) => {
    console.log(req.body)
    try {
        const {datetimestamp, meal_name, data:food} = req.body;
        const userId = req.user.userId;
        const meal= await mealService.addFoodByUser(userId, datetimestamp, meal_name, food);
        res.status(201).json(meal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getMealsByUserId,
    addFoodMeal,
    updateMeal
};