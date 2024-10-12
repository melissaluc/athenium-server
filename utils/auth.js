const jwt = require('jsonwebtoken');
const {s3EnvVars} = require('../utils/aws')


function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); 
    }

    // Verify the token
    jwt.verify(token, s3EnvVars?.JWT_SECRET, { ignoreExpiration: true }, (err, user) => {
        if (err) {
            return res.sendStatus(403); 
        }

        req.user = user; 
        next(); 
    });
}

module.exports = {
    authenticateToken
};
