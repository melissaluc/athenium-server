const express = require("express");
const router = express.Router();

const { authenticateToken } = require('../utils/auth');
const userController = require('../controller/userController');


router.route('/')
    .get(authenticateToken, userController.getUser)

router.route('/settings')
    .put(authenticateToken, userController.updateUser)





module.exports = router;