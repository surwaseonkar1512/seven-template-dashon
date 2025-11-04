import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import bannerRoutes from "./src/routes/HomePageRoutes/bannerRoutes.js"
import homePageRoutes from "./src/routes/homePageRoutes.js"
import testimonialRoutes from "./src/routes/HomePageRoutes/testimonialRoutes.js"





// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/homepage", homePageRoutes);
app.use("/api/testimonials", testimonialRoutes); // <-- register new testimonial routes



// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running successfully ✅" });
});

// Error handling
// app.use(notFound);
// app.use(errorHandler);

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
