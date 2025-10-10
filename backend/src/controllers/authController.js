const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");
const { generateNumericOtp } = require("../utils/generateOtp");
const { otpEmailTemplate } = require("../utils/emailTemplates");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || "10");
const OTP_LENGTH = parseInt(process.env.OTP_LENGTH || "6");

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

async function uploadAvatarToCloudinary(fileBuffer, filename) {
  // fileBuffer is req.file.buffer; upload_stream interface
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "user_avatars", public_id: filename, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
}

exports.signup = async (req, res) => {
  try {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, mobile, domainUrl } = req.body;

    // check if exists
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      domainUrl,
      isVerified: false,
      role: "user",
    });

    // avatar upload (optional)
    if (req.file) {
      const result = await uploadAvatarToCloudinary(
        req.file.buffer,
        `${Date.now()}_${email}`
      );
      user.avatar = result.secure_url;
      user.avatarPublicId = result.public_id;
    }

    // generate OTP
    const otpPlain = generateNumericOtp(OTP_LENGTH);
    const hashedOtp = await bcrypt.hash(otpPlain, 10);
    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

    await user.save();

    // send OTP email
    const { subject, html } = otpEmailTemplate({
      name: user.name,
      otp: otpPlain,
      purpose: "signup verification",
      expiryMinutes: OTP_EXPIRY_MINUTES,
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject,
      html,
    });

    return res
      .status(201)
      .json({ message: "User created. OTP sent to email for verification." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and otp required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    if (!user.otp || !user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired or not present" });
    }

    const match = await bcrypt.compare(otp, user.otp);
    if (!match) return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = signToken(user);
    return res.json({ message: "Verified", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.passwordLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.password)
      return res
        .status(400)
        .json({ message: "Password not set. Use OTP login." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      // Optionally: block login for unverified users
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    const token = signToken(user);
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpPlain = generateNumericOtp(OTP_LENGTH);
    const hashedOtp = await bcrypt.hash(otpPlain, 10);
    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
    await user.save();

    const { subject, html } = otpEmailTemplate({
      name: user.name,
      otp: otpPlain,
      purpose: "login",
      expiryMinutes: OTP_EXPIRY_MINUTES,
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject,
      html,
    });

    return res.json({ message: "Login OTP sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired or not present" });

    const match = await bcrypt.compare(otp, user.otp);
    if (!match) return res.status(400).json({ message: "Invalid OTP" });

    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isVerified = true;
    await user.save();

    const token = signToken(user);
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPasswordSendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpPlain = generateNumericOtp(OTP_LENGTH);
    const hashedOtp = await bcrypt.hash(otpPlain, 10);
    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
    await user.save();

    const { subject, html } = otpEmailTemplate({
      name: user.name,
      otp: otpPlain,
      purpose: "password reset",
      expiryMinutes: OTP_EXPIRY_MINUTES,
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject,
      html,
    });

    return res.json({ message: "Password reset OTP sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res
        .status(400)
        .json({ message: "email, otp and newPassword required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired or not present" });

    const match = await bcrypt.compare(otp, user.otp);
    if (!match) return res.status(400).json({ message: "Invalid OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin route: create user with role
exports.adminCreateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "user",
      mobile,
      domainUrl,
    } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "name, email, password required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already used" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      mobile,
      domainUrl,
      isVerified: true, // admin created -> verified
    });

    if (req.file) {
      const result = await uploadAvatarToCloudinary(
        req.file.buffer,
        `${Date.now()}_${email}`
      );
      user.avatar = result.secure_url;
      user.avatarPublicId = result.public_id;
    }

    await user.save();
    return res
      .status(201)
      .json({
        message: "User created by admin",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
