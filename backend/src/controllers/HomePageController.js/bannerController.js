const cloudinary = require("../../config/cloudinary");
const Banner = require("../../models/HomepageModels/Banner");
const User = require("../../models/User");
const HomePage = require("../../models/HomePage");
const streamifier = require("streamifier");


// ✅ Get HomePage with all sections by User ID
exports.getHomePageByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("homePage");
        if (!user) return res.status(404).json({ message: "User not found" });

        const homePage = await HomePage.findById(user.homePage)
            .populate("banners")
            .populate("aboutInstitute")
            .populate("faculties");

        if (!homePage)
            return res.status(404).json({ message: "Home page not found" });

        res.status(200).json({
            message: "Home page data fetched successfully",
            homePage,
        });
    } catch (err) {
        console.error("Error in getHomePageByUserId:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ✅ Add a new Banner
exports.addBanner = async (req, res) => {
    try {
        const { title, description, userId, domainUrl } = req.body;
        const files = req.files || {};

        const uploadFromBuffer = (buffer, folder) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
                    if (result) resolve(result);
                    else reject(err);
                });
                streamifier.createReadStream(buffer).pipe(stream);
            });
        };

        // Then in your addBanner function:
        const mainImageResult = await uploadFromBuffer(files.mainImage[0].buffer, "banners");

        let sideImageResult = null;
        if (files.sideImage && files.sideImage.length > 0) {
            sideImageResult = await uploadFromBuffer(files.sideImage[0].buffer, "banners");
        }

        // Get or create user's HomePage
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        let homePage = await HomePage.findById(user.homePage);
        if (!homePage) {
            homePage = new HomePage({ user: user._id });
            await homePage.save();
            user.homePage = homePage._id;
            await user.save();
        }

        // Create banner
        const banner = new Banner({
            title,
            description,
            userId,
            domainUrl,
            homePage: homePage._id,
            imageUrl: mainImageResult.secure_url,
            imagePublicId: mainImageResult.public_id,
            sideImageUrl: sideImageResult ? sideImageResult.secure_url : undefined,
            sideImagePublicId: sideImageResult ? sideImageResult.public_id : undefined,
        });

        await banner.save();

        // Add banner reference to homepage
        homePage.banners.push(banner._id);
        await homePage.save();

        res.status(201).json({
            message: "Banner added successfully",
            banner,
        });
    } catch (err) {
        console.error("Error in addBanner:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ✅ Get all banners
exports.getBanners = async (req, res) => {
    try {
        const { userId, domainUrl } = req.query;
        const filter = {};
        if (userId) filter.userId = userId;
        if (domainUrl) filter.domainUrl = domainUrl;

        const banners = await Banner.find(filter).sort({ createdAt: -1 });
        res.status(200).json(banners);
    } catch (err) {
        console.error("Error in getBanners:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ✅ Get single banner
exports.getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ message: "Banner not found" });
        res.status(200).json(banner);
    } catch (err) {
        console.error("Error in getBannerById:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ✅ Update banner (with optional image replacement)
exports.updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ message: "Banner not found" });

        const { title, description, domainUrl, isActive } = req.body;
        const files = req.files || {};

        // Basic field updates
        if (title) banner.title = title;
        if (description) banner.description = description;
        if (domainUrl) banner.domainUrl = domainUrl;
        if (isActive !== undefined) banner.isActive = isActive;

        // Handle main image update
        if (files.mainImage && files.mainImage.length > 0) {
            if (banner.imagePublicId) {
                try {
                    await cloudinary.uploader.destroy(banner.imagePublicId);
                } catch (err) {
                    console.warn("⚠️ Could not delete old main image:", err.message);
                }
            }
            const mainImageResult = await cloudinary.uploader.upload(
                files.mainImage[0].path,
                { folder: "banners" }
            );
            banner.imageUrl = mainImageResult.secure_url;
            banner.imagePublicId = mainImageResult.public_id;
        }

        // Handle side image update
        if (files.sideImage && files.sideImage.length > 0) {
            if (banner.sideImagePublicId) {
                try {
                    await cloudinary.uploader.destroy(banner.sideImagePublicId);
                } catch (err) {
                    console.warn("⚠️ Could not delete old side image:", err.message);
                }
            }
            const sideImageResult = await cloudinary.uploader.upload(
                files.sideImage[0].path,
                { folder: "banners" }
            );
            banner.sideImageUrl = sideImageResult.secure_url;
            banner.sideImagePublicId = sideImageResult.public_id;
        }

        await banner.save();
        res.status(200).json({ message: "Banner updated successfully", banner });
    } catch (err) {
        console.error("Error in updateBanner:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ✅ Delete banner + Cloudinary cleanup
exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ message: "Banner not found" });

        // Delete both images from Cloudinary
        const imagesToDelete = [banner.imagePublicId, banner.sideImagePublicId].filter(Boolean);
        for (const imgId of imagesToDelete) {
            try {
                await cloudinary.uploader.destroy(imgId);
                console.log(`🗑️ Cloudinary image deleted: ${imgId}`);
            } catch (err) {
                console.warn("⚠️ Cloudinary deletion warning:", err.message);
            }
        }

        // Remove from homepage
        await HomePage.updateMany({ banners: banner._id }, { $pull: { banners: banner._id } });

        // Delete banner record
        await Banner.deleteOne({ _id: banner._id });

        res.status(200).json({ message: "Banner and Cloudinary images deleted successfully" });
    } catch (err) {
        console.error("Error in deleteBanner:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
