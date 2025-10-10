const { body } = require("express-validator");

const signupValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
];

const loginValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const otpRequestValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
];

module.exports = { signupValidator, loginValidator, otpRequestValidator };
