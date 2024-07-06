const express = require("express");
const router = express.Router();
const fs = require("fs");

const trendsController = require('../controller/trendsController');


router.route('/:userId')
    .get(trendsController.getTrendsByUserId)




module.exports = router;