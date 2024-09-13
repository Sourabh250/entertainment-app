const { check, param } = require("express-validator");

const signupValidation = [
  check("email").isEmail().withMessage("Invalid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginValidation = [
  check("email").isEmail().withMessage("Invalid email"),
  check("password").notEmpty().withMessage("Password is required"),
];

const validateSearch = [
  param("query")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Search query is required"),
];

const validateId = [
  param("id").trim().escape().isInt().withMessage("Invalid id"),
];

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
