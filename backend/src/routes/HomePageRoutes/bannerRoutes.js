const express = require("express");
const router = express.Router();
const bannerController = require("../../controllers/HomePageController.js/bannerController");
const multer = require("multer");

// Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CRUD routes
router.post(
    "/",
    upload.fields([{ name: "mainImage" }, { name: "sideImage" }]),
    bannerController.addBanner
);

router.put(
    "/:id",
    upload.fields([{ name: "mainImage" }, { name: "sideImage" }]),
    bannerController.updateBanner
);
router.get("/", bannerController.getBanners);
router.get("/:id", bannerController.getBannerById);
router.delete("/:id", bannerController.deleteBanner);

module.exports = router;
