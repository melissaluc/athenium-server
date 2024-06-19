const express = require("express");
const router = express.Router();
const fs = require("fs");

const mealsController = require('../controller/mealsController');


router.route('/:userId')
    .get(mealsController.getMealsByUserId)
    .post(mealsController.addFoodMeal)
    .patch(mealsController.updateMeal)




module.exports = router;