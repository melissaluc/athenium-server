const express = require("express");
const router = express.Router();
const fs = require("fs");

const workoutsController = require('../controller/workoutsController');


router.route('/:userId')
    .get(workoutsController.getWorkoutsByUserId)
    .post(workoutsController.createWorkout)

    
router.route('/:userId/:workoutId')
    .get(workoutsController.getWorkout) //get single workout
    .delete(workoutsController.deleteWorkout) //delete single workout
    .patch(workoutsController.updateWorkout) // update single workout





module.exports = router;