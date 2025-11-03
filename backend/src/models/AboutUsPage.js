const mongoose = require("mongoose");

const AboutUsPageSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        sections: [
            {
                title: { type: String, trim: true },
                order: { type: Number, default: 0 },
                content: { type: mongoose.Schema.Types.Mixed },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("AboutUsPage", AboutUsPageSchema);
