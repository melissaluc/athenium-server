const express = require("express");
const router = express.Router();

const { authenticateToken } = require('../utils/auth');
const dashboardController = require('../controller/dashboardController');


router.route('/')
    .get(authenticateToken, dashboardController.getBodyCompositionByUserId)





module.exports = router;