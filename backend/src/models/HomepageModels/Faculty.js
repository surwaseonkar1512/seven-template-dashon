const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema(
    {
        homePage: { type: mongoose.Schema.Types.ObjectId, ref: "HomePage", required: true },
        name: { type: String, required: true, trim: true },
        designation: { type: String, trim: true },
        department: { type: String, trim: true },
        photo: { type: String },
        bio: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Faculty", FacultySchema);
