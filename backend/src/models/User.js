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
    password: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    avatar: { type: String },
    avatarPublicId: { type: String },
    domainUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },

    // 🔹 Reference to homepage content (single document)
    homePage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HomePage",
    },

    // 🔹 Reference to About Us page (single document)
    aboutUs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AboutUsPage",
    },

    // 🔹 Reference to Contact Us page (single document)
    contactUs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContactUsPage",
    },

    // 🔹 Reference to multiple Achievement Categories (each with many achievements)
    achievementPages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AchievementCategory",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
