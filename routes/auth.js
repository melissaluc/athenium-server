const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require('jsonwebtoken');
const knex = require('../utils/db');
const bcrypt = require('bcrypt');


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
        const authData = {
            username: res.username,
            email: res.email
        };

          authenticateUser({ body: authData }, res)
        }
    )


router.route('/google/login')
    .post(
        //  Redirect to google for auth initiate google oauth
        async (req, res) => {
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
              res.status(500).json({ error: 'Server error' });
            }
          }
    );

    
// Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout error' });
        res.redirect(`${process.env.CLIENT_URL}/login`);
    });
    });

module.exports = router
