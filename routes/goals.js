const express = require("express");
const router = express.Router();
const fs = require("fs");

const goalsController = require('../controller/goalsController');


router.route('/:userId')
    .get(goalsController.getByUserId)
    .post(goalsController.addGoal)

    
router.route('/:userId/:goalId')
    .delete(goalsController.deleteGoal)
    .put(goalsController.updateGoal)


module.exports = router;