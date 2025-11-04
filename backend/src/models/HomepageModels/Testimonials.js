const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        role: { type: String },
        review: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        imageUrl: { type: String }, // Reviewer photo (Cloudinary URL)
        imagePublicId: { type: String }, // For Cloudinary deletion
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        homePage: { type: mongoose.Schema.Types.ObjectId, ref: "HomePage", required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Testimonial", TestimonialSchema);
