const express = require("express");
const router = express.Router();
const fs = require("fs");

const scheduleController = require('../controller/scheduleController');


router.route('/:userId')
    .get(scheduleController.getByUserId)
    // .post(scheduleController.createSchedule)

    
// router.route('/:userId/:activityId')
//     .get(scheduleController.getSchedule) 
//     .delete(scheduleController.deleteSchedule) 
//     .patch(scheduleController.updateSchedule) 





module.exports = router;