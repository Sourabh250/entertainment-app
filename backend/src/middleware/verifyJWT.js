const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();

const JWT = process.env.JWT_SECRET;

const verifyJWT = (req, res, next) => {
    const token = req.header('x-access-token');
    if (!token) {
        return res.status(403).json({message: 'Access Denied: No token provided'});
    }

    try {
        const signed = jwt.verify(token, JWT);
        req.userId = signed.userId;
        next();
    } catch (error) {
        res.status(401).json({message: 'Access Denied: Invalid token'});
    }
};

module.exports = verifyJWT;