const express = require("express");
const router = express.Router();
const {verifyCodeAndActivateUser, sendVerificationCode} = require('../utils/verifyEmail')


// Route to handle email verification
router.route('/')
    .post(async (req, res) => {
        const { email_address, verification_code, userData, action } = req.body;


        if (!email_address || !action) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        try {
            if (action === 'verify_email') {
                if (!verification_code) {
                    return res.status(400).json({ success: false, message: 'Verification code is required' });
                }

                const result = await verifyCodeAndActivateUser(email_address, verification_code);
                return res.status(200).json(result);

            } else if (action === 'resend_code') {
                if (!userData) {
                    return res.status(400).json({ success: false, message: 'User data is required' });
                }

                const result = await sendVerificationCode(email_address, userData);
                return res.status(200).json(result);
            } else {
                return res.status(400).json({ success: false, message: 'Invalid action' });
            }

        } catch (error) {
            console.error('Error in verification route:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    });


module.exports = router;
