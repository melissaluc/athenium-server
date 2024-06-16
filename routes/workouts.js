const express = require("express");
const router = express.Router();
const fs = require("fs");

const workoutsController = require('../controller/workoutsController');


router.route('/:userId')
    .get(workoutsController.getWorkoutsByUserId)
    .post(workoutsController.createWorkout)
    .patch(workoutsController.updateWorkout)
    .delete(workoutsController.deleteWorkout)




module.exports = router;