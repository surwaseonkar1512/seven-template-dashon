const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// Get all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -otp");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -otp");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user (self or admin)
exports.updateUser = async (req, res) => {
  try {
    const { name, mobile, domainUrl } = req.body;
    const targetId = req.params.id === "me" ? req.user._id : req.params.id;

    const user = await User.findById(targetId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name !== undefined) user.name = name;
    if (mobile !== undefined) user.mobile = mobile;
    if (domainUrl !== undefined) user.domainUrl = domainUrl;
    if (req.body.role && req.user.role === "admin") {
      // allow role update only by admin
      user.role = req.body.role;
    }

    // avatar update
    if (req.file) {
      // delete old
      if (user.avatarPublicId) {
        try {
          await cloudinary.uploader.destroy(user.avatarPublicId);
        } catch (err) {
          console.warn("Cloudinary deletion warning:", err.message);
        }
      }
      // upload new
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "user_avatars" },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      user.avatar = result.secure_url;
      user.avatarPublicId = result.public_id;
    }

    await user.save();
    res.json({
      message: "User updated",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user (admin or self)
exports.deleteUser = async (req, res) => {
  try {
    const targetId = req.params.id === "me" ? req.user._id : req.params.id;
    const user = await User.findById(targetId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // cleanup cloudinary avatar
    if (user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (err) {
        console.warn("Cloudinary deletion warning:", err.message);
      }
    }

    await user.remove();
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
