const express = require("express");
const router = express.Router();

const goalsController = require('../controller/goalsController');
const { authenticateToken } = require('../utils/auth');

router.route('/')
    .get(authenticateToken, goalsController.getByUserId)
    .post(authenticateToken, goalsController.addGoal)

    
router.route('/:goalId')
    .delete(authenticateToken, goalsController.deleteGoal)
    .put(authenticateToken, goalsController.updateGoal)


module.exports = router;