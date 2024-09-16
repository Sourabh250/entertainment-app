const { check, param } = require("express-validator");

// Validation rules for user signup
const signupValidation = [
  check("email").isEmail().withMessage("Invalid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Validation rules for user login
const loginValidation = [
  check("email").isEmail().withMessage("Invalid email"),
  check("password").notEmpty().withMessage("Password is required"),
];

// Validation rules for search queries
const validateSearch = [
  param("query")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Search query is required"),
];

// Validation rules for ID parameters
const validateId = [
  param("id").trim().escape().isInt().withMessage("Invalid id"),
];

// Validation rules for bookmark operations
const validateBookmark = [
  check("itemId").trim().escape().isInt().withMessage("Invalid item id"),
  check("isMovie")
    .exists()
    .withMessage("isMovie is required")
    .isBoolean()
    .withMessage("isMovie must be either true or false"),
];

module.exports = {
  signupValidation,
  loginValidation,
  validateSearch,
  validateId,
  validateBookmark,
};