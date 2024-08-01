const express = require("express");
const router = express.Router();


const strengthsController = require('../controller/strengthController');
const { authenticateToken } = require('../utils/auth');

router.route('/')
    .get(authenticateToken, strengthsController.getStrengthByUserId)
    .post(authenticateToken, strengthsController.createStrength)




module.exports = router;