const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { signupValidation, loginValidation } = require('../middleware/validation');
const handleValidationErrors = require('../middleware/validationErrors');
const env = require('dotenv');
env.config();

const JWT = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;


router.post('/signup', signupValidation, handleValidationErrors, async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({message: 'User created successfully'});
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

router.post('/login', loginValidation, handleValidationErrors, async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({message: 'No account found with that email'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid password'});
        }

        const token = jwt.sign({ userId: user._id}, JWT, { expiresIn: '15m'});
        const refreshToken = jwt.sign({ userId: user._id}, REFRESH_SECRET, { expiresIn: '7d'});
        console.log('Setting refreshToken cookie:', refreshToken);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({message: 'User logged in successfully', token});
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
})

router.post('/logout', (req, res) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
    
        res.status(200).json({message: 'User logged out successfully'});
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

router.post("/refresh-token", async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    console.log('Received refreshToken cookie:', req.cookies.refreshToken);
    if (!refreshToken) {
        return res.status(403).json({message: 'Access Denied: No Refresh token provided'});
    }

    try {
        const signed = jwt.verify(refreshToken, REFRESH_SECRET);
        const token = jwt.sign({ userId: signed.userId}, JWT, { expiresIn: '15m'});
        res.status(200).json({message: 'Token refreshed successfully', token});
    } catch (error) {
        return res.status(401).json({message: 'Access Denied: Invalid Refresh token'});
    }
});

module.exports = router;