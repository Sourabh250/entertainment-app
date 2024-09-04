const { check, param } = require('express-validator');

const signupValidation = [
    check('email').isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
    check('email').isEmail().withMessage('Invalid email'),
    check('password').notEmpty().withMessage('Password is required'),
];

const validateSearch = [
    param('query').trim().escape().notEmpty().withMessage('Search query is required'),
];

const validateId = [
    param('id').trim().escape().isMongoId().withMessage('Invalid id'),
];

const validateBookmark = [
    check('itemId').trim().escape().isMongoId().withMessage('Invalid item id'),
];

module.exports = {
    signupValidation,
    loginValidation,
    validateSearch,
    validateId,
    validateBookmark,
};