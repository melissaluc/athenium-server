const nodemailer = require("nodemailer");
const knex = require('./db');
const { v4: uuidv4 } = require('uuid')
const {addNewUser} = require('../utils/signup')
const crypto = require('crypto');
// Create the transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use appropriate email service
    auth: {
        user: process.env.NOREPLY_EMAIL,
        pass: process.env.NOREPLY_EMAIL_PASSWORD,
    },
});

// Save the user for verification
const saveUserForVerification = async (email_address, userData) => {
    
    try {
        const query = await knex('user_verification')
        .where({"email_address":email_address})
        .first()
        if(query.code) {
            console.log('User already exists')
            return query.code;
        } else {
            const code = crypto.randomBytes(3).toString('hex').toUpperCase();
            const userId = uuidv4(); // Generate a UUID for the user ID
            await knex('user_verification').insert({
                user_id: userId,
                email_address:  email_address,
                code: code,
                action:'verify_email',
                user_data: userData,
                expires_at: new Date(Date.now() + 3600000) // 1 hour expiration
            }).returning('*');
            console.log('Saved user and verification code')
            return code;
        }

    } catch (error) {
        console.error('Error saving verification code:', error);
        throw error;
    }
};

// Send the verification email
const sendVerificationEmail = async (first_name, email_address, code) => {
    console.log(email_address)
    try {
        const mailOptions = {
            from: process.env.NOREPLY_EMAIL,
            to: email_address,
            subject: 'Your Athenium Verification Code 🦉🔱',
            html: `
                <html>
                    <style>
                    </style>
                    <head>
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap" rel="stylesheet">
                    </head>
                    <div>
                        <p>Hi ${first_name},</p>
                        <p>Your verification code is <b>${code}</b>. It will expire in 1 hour.</p>
                        <h1 style="font-family: 'Silkscreen', sans-serif;" >Athenium</h1>
                    </div>
                </html>
            `
        };

        // Send email and handle promise
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully.');
        return {success:true, msg:'Verification email sent successfully.'}
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

// Verify the code and activate the user
const verifyCodeAndActivateUser = async (email_address, code) => {
    try {
        const verification = await knex('user_verification')
            .where('email_address', email_address)
            .andWhere('action','verify_email')
            .andWhere('code', code)
            .first();

        if (!verification || new Date() > new Date(verification.expires_at)) {
            throw new Error('Invalid or expired code');
        }

        const user = verification.user_data;
        await addNewUser(user);

        // Delete verification record
        await knex('user_verification').where('email_address', email_address).andWhere('code', code).del();

        return { success: true , msg:'New user created and verified'};
    } catch (error) {
        console.error('Error verifying code:', error);
        throw error;
    }
};

module.exports = {saveUserForVerification, sendVerificationEmail, verifyCodeAndActivateUser}