const express = require("express");
const router = express.Router();
const fs = require("fs");

const strengthsController = require('../controller/strengthController');


router.route('/:userId')
    .get(strengthsController.getStrengthByUserId)
    .post(strengthsController.createStrength)




module.exports = router;