const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const authController = require("../controllers/authController");
const {
  signupValidator,
  loginValidator,
  otpRequestValidator,
} = require("../validators/authValidators");

// signup (with optional avatar)
router.post(
  "/signup",
  upload.single("avatar"),
  signupValidator,
  authController.signup
);
router.post("/verify-signup-otp", authController.verifySignupOtp);

// password login
router.post("/login", loginValidator, authController.passwordLogin);

// OTP flows
router.post(
  "/send-login-otp",
  otpRequestValidator,
  authController.sendLoginOtp
);
router.post("/verify-login-otp", authController.verifyLoginOtp);

// forgot password
router.post("/forgot-password", authController.forgotPasswordSendOtp);
router.post("/reset-password", authController.resetPasswordWithOtp);

module.exports = router;
