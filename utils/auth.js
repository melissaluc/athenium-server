const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); 
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true }, (err, user) => {
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
