const express = require("express");
const router = express.Router();


const scheduleController = require('../controller/scheduleController');
const { authenticateToken } = require('../utils/auth');

router.route('/')
    .get(authenticateToken, scheduleController.getByUserId)
    // .post(scheduleController.createSchedule)

    
// router.route('/:userId/:activityId')
//     .get(scheduleController.getSchedule) 
//     .delete(scheduleController.deleteSchedule) 
//     .patch(scheduleController.updateSchedule) 





module.exports = router;