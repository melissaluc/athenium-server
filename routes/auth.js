const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require('jsonwebtoken');
const knex = require('../utils/db');
const bcrypt = require('bcrypt');
const {sendVerificationCode} = require('../utils/verifyEmail')
const {addNewUser} = require('../utils/signup')

async function authenticateUser(req, res) {
    const { google_id, email, username, password } = req.body;

    try {
        let userCheck;

        if (google_id && email) {
            // Check for Google ID and email pair
            userCheck = await knex('users')
                .where({ 'email_address': email })
                .andWhere({ 'google_id': google_id })
                .first();
        } else if (username && password) {
            // Check for username and password pair
            userCheck = await knex('users')
                .where({ 'username': username })
                .first();
            // If a user with the username is found, verify the password
            if (userCheck && await bcrypt.compare(password, userCheck.password)) {
                // Password is correct, generate JWT token
                const authToken = jwt.sign(
                    { userId: userCheck.user_id, email: userCheck.email },
                    process.env.JWT_SECRET, 
                    { algorithm: 'HS256', expiresIn: '1h' } 
                );
                
                return res.json({
                    success: true,
                    token: authToken,
                });
            } else {
                return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Invalid request parameters' });
        }

        // If userCheck exists and is valid, generate JWT token
        if (userCheck && userCheck.user_id) {
            const authToken = jwt.sign(
                { userId: userCheck.user_id, email: userCheck.email },
                process.env.JWT_SECRET, 
                { algorithm: 'HS256', expiresIn: '1h' } 
            );

            return res.json({
                success: true,
                token: authToken,
            });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}



// Auth Routes
router.route('/login')
    .post(
      async (req, res) => {
        authenticateUser({ body: req.body }, res)
        }
    )


router.route('/google/login')
    .post(async (req, res) => {
        const { token } = req.body;
        try {
            const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
            const data = await response.json();
            
            if (data.error) {
                return res.status(400).json({ error: data.error_description });
            }

            const authData = {
                google_id: data.sub,
                email: data.email
            };

            authenticateUser({ body: authData }, res);
        } catch (error) {
            console.error('Google login error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });


    const findUser = async (username, email_address, google_id) => {
        console.log('Finding user:',username, email_address, google_id)
        try {
            const query = knex('users');
            if (email_address) {
                query.where('email_address', email_address);
            }
            if (username) {
                query.andWhere('username', username);
            }
            if (google_id) {
                query.andWhere('google_id', google_id);
            }
        
            const userCheck = await query.first();
            if (userCheck === undefined) {
                console.log('User not found')
                return { success: true }
            } else {
                console.log('User found')
                return { success: false }
            }

        } catch (error) {
            return { success: false, error: error.message };
        }
    };
    


// Check username & email, create user through google signup and username-password pair
router.route('/signup')
    .post(async (req, res) => {
        const { action, username, email_address, userData} = req.body;
        if (action==='checkUsername') {
            const userExists = await findUser(username, email_address, null)
            console.log('userExists? ',userExists)
            return res.json(userExists)
        } else if (action === 'submit' && userData) {
            if(!userData.google_id){
                try {

                    const result = await sendVerificationCode(userData.email_address, userData)
                    console.log(result)
                    return res.json(result)

                } catch (error) {
                    return res.status(500).json({ success: false, message: 'Failed to create user' });
                }

            } else {
                addNewUser(userData)
            }
        }
    });

// Google sign up
router.route('/google/signup')
    .post(async (req, res) => {
        const { token } = req.body;
        try {

            const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
            const userInfo = await response.json();
            
            if (userInfo.error) {
                return res.status(400).json({ error: userInfo.error_description });
            }

            const name = userInfo.name.split(' ')

            const firstName = userInfo.given_name || name[0];
            const lastName = userInfo.family_name || name[name.length - 1]
            user = {
                google_id: userInfo.sub,
                email_address: userInfo.email,
                first_name:firstName,
                last_name:lastName===firstName ? (firstName===userInfo.family_name ? null : userInfo.family_name) : lastName,
                profile_img: userInfo.picture,
                // locale:userInfo.locale || 'en'
            }

            const userExists = await findUser(null, user.email_address, user.google_id);

            if (!userExists.success) {
                return res.json({
                    success: false,
                    message: 'User already exists'
                });
            } else {
                return res.json({
                    success: true,
                    user
                });
            }

        } catch (error) {
          res.status(500).json({ error: 'Server error' });
        }
      })
      

    
// Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout error' });
        res.redirect(`${process.env.CLIENT_URL}/login`);
    });
    });

module.exports = router;
