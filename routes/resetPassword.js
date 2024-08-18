const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const {sendPasswordResetEmail, updatePassword} = require('../utils/resetPassword')

// Route to handle email verification
router.route('/')
    .post(async (req, res) => {
        const { email_address, action, token, new_password } = req.body;
        console.log('reset password: ',email_address, new_password, token)
        try {
            if (action === 'reset_password_request') {
                const token =  crypto.randomBytes(32).toString('hex');
                const response = await sendPasswordResetEmail(email_address, token)
                if (response.success){
                    return res.status(200).json(response)
                }
            } else if (action === 'reset_password') {
                await updatePassword(email_address, new_password, token)
                return res.status(200).json({ success: true, message: 'Password changed' });
            } else {
                return res.status(400).json({ success: false, message: 'Invalid action' });
            }

        } catch (error) {
            console.error('Error in verification route:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    });


module.exports = router;
