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
        const existingRecord = await knex('user_verification')
        .where({ "email_address": email_address })
        .first();
        console.log('saveUserForVerification existingRecord : ',existingRecord && existingRecord.code )
        
        if (existingRecord && existingRecord.code) {
            console.log('User already exists with pending verification.');
            return existingRecord.code;
        } else {
            const code = crypto.randomBytes(3).toString('hex').toUpperCase();
            const userId = uuidv4(); 
            await knex('user_verification').insert({
                user_id: userId,
                email_address: email_address,
                code: code,
                action: 'verify_email',
                user_data: userData,
                expires_at: new Date(Date.now() + 3600000) 
            }).returning('*');
            console.log('User and verification code saved.');
            return code;
        }
    } catch (error) {
        console.error('Error saving verification code:', error);
        throw new Error('Failed to save verification code.');
    }
};

// Send the verification email
const sendVerificationEmail = async (first_name, email_address, code) => {
    console.log(`send verification code ${code} email to send to: ${email_address}`)
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

// Send the confirmation email
const sendConfirmationEmail = async (first_name, email_address) => {
    console.log(`send confirmation email to: ${email_address}`)
    try {
        const mailOptions = {
            from: process.env.NOREPLY_EMAIL,
            to: email_address,
            subject: `🌟Welcome to Athenium 🦉🔱! 🌟`,
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Athenium!</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 80%;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background: #f4f4f4;
                        padding: 10px 0;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        color: #333;
                    }
                    .content {
                        padding: 20px;
                        background: #fff;
                        border: 1px solid #ddd;
                    }
                    .footer {
                        text-align: center;
                        padding: 10px 0;
                        background: #f4f4f4;
                        border-top: 1px solid #ddd;
                    }
                    .footer p {
                        margin: 0;
                        font-size: 12px;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome ${first_name}!</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${first_name},</p>
                        <p>We're excited to have you on board! You've successfully joined Athenium 🔱.</p>
                        <p>Here’s a quick overview of what you can do next:</p>
                        <ul>
                            <li>Set goals</li>
                            <li>Add girth measurements</li>
                            <li>Add a new workout</li>
                            <li>Log your progress</li>
                            <li>Track your meals</li>
                            <li>Track your strength progression</li>
                        </ul>
                        <p>If you have any questions, feel free to reply to this email or contact our support team at <a href="mailto:support.athenium@gmail.com">support.athenium@gmail.com</a>.</p>
                        <p>We’re here to help you succeed!</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Athenium. All rights reserved.</p>
                    </div>
                </div>
            </body>
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
        console.log('stored userData:',user)
        const newUser = await addNewUser(user)
        if(newUser.success){
            sendConfirmationEmail(user.first_name, email_address)
            // Delete verification record
            await knex('user_verification').where('email_address', email_address).andWhere('code', code).del();
            return { success: true , msg:'New user created and verified'};

        } else {
            return res.status(500).json({ success: false })
        }
    } catch (error) {
        console.error('Error verifying code:', error);
        throw error;
    }
};


const sendVerificationCode = async (email_address, userData ) => {

    const code = await saveUserForVerification(email_address, userData)
    console.log('code generated: ',code)

    if(code){
        const result = await sendVerificationEmail(userData.first_name, email_address, code)
        console.log('result: ',result)
        return result
    }
}



module.exports = {saveUserForVerification, sendVerificationEmail, verifyCodeAndActivateUser, sendVerificationCode}