const express = require("express");
const router = express.Router();
const fs = require("fs");

const dashboardController = require('../controller/dashboardController');


router.route('/:userId')
    .get(dashboardController.getBodyCompositionByUserId)





module.exports = router;