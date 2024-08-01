const express = require("express");
const router = express.Router();

const { authenticateToken } = require('../utils/auth');
const workoutsController = require('../controller/workoutsController');


router.route('/')
    .get(authenticateToken,workoutsController.getWorkoutsByUserId)
    .post(authenticateToken, workoutsController.createWorkout)

    
router.route('/:workoutId')
    .get(authenticateToken,workoutsController.getWorkout) //get single workout
    .delete(authenticateToken,workoutsController.deleteWorkout) //delete single workout
    .patch(authenticateToken,workoutsController.updateWorkout) // update single workout





module.exports = router;