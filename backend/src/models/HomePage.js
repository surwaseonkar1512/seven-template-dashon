const mongoose = require("mongoose");

const HomePageSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        // Reference to multiple section models
        banners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Banner" }],
        aboutInstitute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AboutInstitute",
        },
        faculties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Faculty" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("HomePage", HomePageSchema);
