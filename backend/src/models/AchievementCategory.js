const mongoose = require("mongoose");

const AchievementCategorySchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        description: { type: String },
        achievements: [
            {
                title: { type: String, required: true },
                description: { type: String },
                image: { type: String },
                date: { type: Date },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("AchievementCategory", AchievementCategorySchema);
