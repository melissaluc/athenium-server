const express = require("express");
const router = express.Router();

const { authenticateToken } = require('../utils/auth');
const bodyCompositionController = require('../controller/bodyCompositionController');


router.route('/')
    .post(authenticateToken, bodyCompositionController.addBodyComposition)





module.exports = router;