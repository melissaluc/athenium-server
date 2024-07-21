const express = require("express");
const router = express.Router();
const fs = require("fs");

const userController = require('../controller/userController');


router.route('/:username')
    .get(userController.getUser)





module.exports = router;