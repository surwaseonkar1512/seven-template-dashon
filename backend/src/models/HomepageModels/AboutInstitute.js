const mongoose = require("mongoose");

const AboutInstituteSchema = new mongoose.Schema(
    {
        homePage: { type: mongoose.Schema.Types.ObjectId, ref: "HomePage", required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String },
        image: { type: String }, // Optional image
        mission: { type: String },
        vision: { type: String },
        values: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AboutInstitute", AboutInstituteSchema);
