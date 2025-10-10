const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: { type: String, trim: true },
    password: { type: String }, // hashed
    role: { type: String, enum: ["admin", "user"], default: "user" },
    avatar: { type: String }, // Cloudinary URL
    avatarPublicId: { type: String }, // used for deletion
    domainUrl: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String }, // hashed otp
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
