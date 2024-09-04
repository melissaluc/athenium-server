const express = require("express");
const router = express.Router();


const strengthsController = require('../controller/strengthController');
const { authenticateToken } = require('../utils/auth');

router.route('/')
    .get(authenticateToken, strengthsController.getStrengthByUserId)
    .post(authenticateToken, strengthsController.createStrength)

router.route('/:exerciseName')
    .get(authenticateToken, strengthsController.getExerciseStrengthLogByUserId)
    .post(authenticateToken, strengthsController.createStrength)
    .delete(authenticateToken, strengthsController.deleteStrengthRecords)
    .patch(authenticateToken, strengthsController.updateStrengthRecords)



module.exports = router;