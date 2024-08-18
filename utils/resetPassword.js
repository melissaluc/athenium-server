const nodemailer = require("nodemailer");
const knex = require('./db');
const bcrypt = require('bcrypt');
const {updateUser} = require('../models/userModel')

// Create the transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use appropriate email service
    auth: {
        user: process.env.NOREPLY_EMAIL,
        pass: process.env.NOREPLY_EMAIL_PASSWORD,
    },
});

const storeToken = async (email_address, token) => {

    const user = await knex('users')
    .where({'email_address':email_address})
    .first()
    
    if (user!== undefined) {

        const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
        await knex('password_reset')
            .insert({
                'user_id':user.user_id,
                'token':token,
                'email_address':email_address,
                'action':"reset_password",
                'expires_at':expiresAt,
            })
        
        return user.first_name

    }
}

// Send the reset email
const sendPasswordResetEmail = async (email_address, token) => {
    const first_name = await storeToken(email_address, token)

    if(first_name!==undefined){
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}/${email_address}`;
    
        try {
            const mailOptions = {
                from: process.env.NOREPLY_EMAIL,
                to: email_address,
                subject: 'Athenium Password Reset 🦉🔱',
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
                            <p>Follow the link to reset your password <a href='${resetLink}'>here</a>. Your password reset will expire in 1 hour.</p>
                            <h1 style="font-family: 'Silkscreen', sans-serif;" >Athenium</h1>
                        </div>
                    </html>
                `
            };
    
            // Send email and handle promise
            await transporter.sendMail(mailOptions);
            console.log('Password Reset email sent successfully.');
            return {success:true, msg:'Password Reset email sent successfully.'}
        } catch (error) {
            console.error('Error sending Password Reset email:', error);
            throw error;
        }

    }
};

const updatePassword = async (email_address, new_password, token) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(new_password, saltRounds);

    const user = await knex('users')
    .where({'email_address':email_address})
    .first()

    const userId = user.user_id

    await updateUser(userId, {"password":hashedPassword})

    //  delete from password reset
    await knex('password_reset')
    .where({'email_address':email_address})
    .andWhere({'token':token})
    .del()
}


module.exports = {sendPasswordResetEmail, updatePassword}