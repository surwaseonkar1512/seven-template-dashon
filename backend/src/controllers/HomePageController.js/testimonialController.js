const cloudinary = require("../../config/cloudinary");
const Testimonial = require("../../models/HomepageModels/Testimonials");
const User = require("../../models/User");
const HomePage = require("../../models/HomePage");
const streamifier = require("streamifier");

// ✅ Helper: Upload from memory buffer
const uploadFromBuffer = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
            if (result) resolve(result);
            else reject(err);
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

// ✅ Add a new Testimonial
exports.addTestimonial = async (req, res) => {
    try {
        const { name, role, review, rating, userId, domainUrl } = req.body;
        const files = req.files || {};

        if (!name || !review || !rating || !userId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Upload image if provided
        let imageResult = null;
        if (files.image && files.image.length > 0) {
            imageResult = await uploadFromBuffer(files.image[0].buffer, "testimonials");
        }

        // Get or create HomePage
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        let homePage = await HomePage.findById(user.homePage);
        if (!homePage) {
            homePage = new HomePage({ user: user._id });
            await homePage.save();
            user.homePage = homePage._id;
            await user.save();
        }

        // Create testimonial
        const testimonial = new Testimonial({
            name,
            role,
            review,
            rating,
            userId,
            domainUrl,
            homePage: homePage._id,
            imageUrl: imageResult ? imageResult.secure_url : undefined,
            imagePublicId: imageResult ? imageResult.public_id : undefined,
        });

        await testimonial.save();

        // Push testimonial reference to HomePage
        homePage.testimonials = homePage.testimonials || [];
        homePage.testimonials.push(testimonial._id);
        await homePage.save();

        res.status(201).json({
            message: "Testimonial added successfully",
            testimonial,
        });
    } catch (err) {
        console.error("Error in addTestimonial:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ✅ Get all testimonials
exports.getTestimonials = async (req, res) => {
    try {
        const { userId, domainUrl } = req.query;
        const filter = {};
        if (userId) filter.userId = userId;
        if (domainUrl) filter.domainUrl = domainUrl;

        const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
        res.status(200).json(testimonials);
    } catch (err) {
        console.error("Error in getTestimonials:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ✅ Get testimonial by ID
exports.getTestimonialById = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial)
            return res.status(404).json({ message: "Testimonial not found" });

        res.status(200).json(testimonial);
    } catch (err) {
        console.error("Error in getTestimonialById:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ✅ Update testimonial (with optional image update)
exports.updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial)
            return res.status(404).json({ message: "Testimonial not found" });

        const { name, role, review, rating, domainUrl, isActive } = req.body;
        const files = req.files || {};

        if (name) testimonial.name = name;
        if (role) testimonial.role = role;
        if (review) testimonial.review = review;
        if (rating) testimonial.rating = rating;
        if (domainUrl) testimonial.domainUrl = domainUrl;
        if (isActive !== undefined) testimonial.isActive = isActive;

        // Handle new image
        if (files.image && files.image.length > 0) {
            if (testimonial.imagePublicId) {
                try {
                    await cloudinary.uploader.destroy(testimonial.imagePublicId);
                } catch (err) {
                    console.warn("⚠️ Could not delete old image:", err.message);
                }
            }
            const imageResult = await cloudinary.uploader.upload(
                files.image[0].path,
                { folder: "testimonials" }
            );
            testimonial.imageUrl = imageResult.secure_url;
            testimonial.imagePublicId = imageResult.public_id;
        }

        await testimonial.save();
        res.status(200).json({ message: "Testimonial updated successfully", testimonial });
    } catch (err) {
        console.error("Error in updateTestimonial:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ✅ Delete testimonial
exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial)
            return res.status(404).json({ message: "Testimonial not found" });

        // Delete Cloudinary image
        if (testimonial.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(testimonial.imagePublicId);
            } catch (err) {
                console.warn("⚠️ Cloudinary deletion failed:", err.message);
            }
        }

        // Remove from HomePage references
        await HomePage.updateMany(
            { testimonials: testimonial._id },
            { $pull: { testimonials: testimonial._id } }
        );

        await Testimonial.deleteOne({ _id: testimonial._id });
        res.status(200).json({ message: "Testimonial deleted successfully" });
    } catch (err) {
        console.error("Error in deleteTestimonial:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
