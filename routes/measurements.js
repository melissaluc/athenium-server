const express = require("express");
const router = express.Router();
const fs = require("fs");

const measurementsController = require('../controller/measurementsController');


router.route('/:userId')
    .get(measurementsController.getMeasurementsByUserId)
    .post(measurementsController.createMeasurement)
    .patch(measurementsController.updateMeasurement)




module.exports = router;