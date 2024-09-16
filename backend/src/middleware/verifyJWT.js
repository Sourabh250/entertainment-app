const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();

const JWT = process.env.JWT_SECRET;

const verifyJWT = (req, res, next) => {
    // Extracting the token from the 'x-access-token' header
    const token = req.header('x-access-token');
    // If no token is provided, responding with a 403 Forbidden status
    if (!token) {
        return res.status(403).json({message: 'Access Denied: No token provided'});
    }

    try {
        const signed = jwt.verify(token, JWT);
        req.userId = signed.userId; // Attaching the user ID to the request object
        next(); // Proceeding to the next middleware or route handler
    } catch (error) {
        // If token verification fails, responding with a 401 Unauthorized status
        res.status(401).json({message: 'Access Denied: Invalid token'});
    }
};

const verifyJWTforSearch = (req, res, next) => {
    const token = req.header('x-access-token');
    // If a token is provided, verify it
    if (token) {
        try {
            const signed = jwt.verify(token, JWT);
            req.userId = signed.userId;
        } catch (error) {
            console.error('Invalid token', error);
        }
    }
    next(); // Proceeding to the next middleware or route handler regardless of the token
};

module.exports = { verifyJWT, verifyJWTforSearch };