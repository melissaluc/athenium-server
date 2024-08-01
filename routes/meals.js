const express = require("express");
const router = express.Router();


const mealsController = require('../controller/mealsController');
const { authenticateToken } = require('../utils/auth');

router.route('/')
    .get(authenticateToken, mealsController.getMealsByUserId)
    .post(authenticateToken, mealsController.addFoodMeal)
    .patch(authenticateToken, mealsController.updateMeal)




module.exports = router;