const express = require("express");
const router = express.Router();
const { getHomePageByUserId } = require("../controllers/HomePageController.js/bannerController");

router.get("/:userId", getHomePageByUserId);

module.exports = router;
