const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { connectDB } = require("../config/db"); // use your connectDB function
const User = require("../models/User");

dotenv.config();

(async () => {
  try {
    // connect to MongoDB
    await connectDB(process.env.MONGO_URI);

    const email = process.env.SEED_ADMIN_EMAIL;
    if (!email) {
      console.error("❌ SEED_ADMIN_EMAIL not found in .env");
      process.exit(1);
    }

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("👤 Admin already exists:", email);
      await mongoose.disconnect();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      process.env.SEED_ADMIN_PASSWORD || "Admin@123",
      10
    );

    const admin = new User({
      name: process.env.SEED_ADMIN_NAME || "Admin",
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    await admin.save();
    console.log("✅ Admin seeded successfully:", email);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
})();
