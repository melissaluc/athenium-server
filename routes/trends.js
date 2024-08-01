const express = require("express");
const router = express.Router();


const trendsController = require('../controller/trendsController.js');
const { authenticateToken } = require('../utils/auth');

router.route('/')
    .get(authenticateToken, trendsController.getTrendsByUserId)




module.exports = router;