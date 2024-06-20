const express = require("express");
const router = express.Router();
const fs = require("fs");

const goalsController = require('../controller/goalsController');


router.route('/:userId')
    .get(goalsController.getByUserId)
    // .post(goalsController.addGoalMeal)
    // .patch(goalsController.updateGoal)
    // .delete(goalsController.deleteGoal)




module.exports = router;