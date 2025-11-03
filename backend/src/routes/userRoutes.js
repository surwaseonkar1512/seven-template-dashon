const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

// get profile
router.get("/me", authMiddleware, userController.getProfile);

// update profile (self)
router.put(
  "/me",
  authMiddleware,
  upload.single("avatar"),
  userController.updateUser
);

// delete self
router.delete("/me", authMiddleware, userController.deleteUser);

// admin-only: get all users, create user, delete user, update user
router.get("/", authMiddleware, adminMiddleware, userController.getAllUsers);
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  upload.single("avatar"),
  authController.adminCreateUser
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("avatar"),
  userController.updateUser
);

router.post(
  "/toggleUserActive/:id",
  authMiddleware,
  adminMiddleware,
  userController.toggleUserActive
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userController.deleteUser
);

module.exports = router;
