// models/HomepageModels/Banner.js
const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true }, // Full image URL from Cloudinary
    imagePublicId: { type: String, required: true }, // Unique Cloudinary ID used for deletion
    sideImageUrl: { type: String }, // Optional secondary image (e.g., right/left)
    sideImagePublicId: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    domainUrl: { type: String },
    homePage: { type: mongoose.Schema.Types.ObjectId, ref: "HomePage", required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Banner", BannerSchema);
