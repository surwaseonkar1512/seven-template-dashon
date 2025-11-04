const express = require("express");
const router = express.Router();
const testimonialController = require("../../controllers/HomePageController.js/testimonialController");
const multer = require("multer");

// ✅ Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ CRUD routes
router.post("/", upload.fields([{ name: "image" }]), testimonialController.addTestimonial);
router.put("/:id", upload.fields([{ name: "image" }]), testimonialController.updateTestimonial);
router.get("/", testimonialController.getTestimonials);
router.get("/:id", testimonialController.getTestimonialById);
router.delete("/:id", testimonialController.deleteTestimonial);

module.exports = router;
