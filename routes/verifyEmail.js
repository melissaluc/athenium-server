const express = require("express");
const router = express.Router();
const {verifyCodeAndActivateUser} = require('../utils/verifyEmail')


// Route to handle email verification
router.post('/verify-email', async (req, res) => {
    const { email_address, verification_code } = req.body;
    try {
        const result = await verifyCodeAndActivateUser(email_address, verification_code);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Verification failed' });
    }
});

module.exports = router;
