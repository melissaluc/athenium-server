const express = require("express");
const router = express.Router();


const measurementsController = require('../controller/measurementsController');
const { authenticateToken } = require('../utils/auth');

router.route('/')
    .get(authenticateToken, measurementsController.getMeasurementsByUserId)
    .post(authenticateToken, measurementsController.createMeasurement)
    .patch(authenticateToken, measurementsController.updateMeasurement)




module.exports = router;