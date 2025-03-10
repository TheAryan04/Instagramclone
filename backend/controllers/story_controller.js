import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Story } from "../models/story_model.js";
import { User } from "../models/user_model.js";

export const addStory = async (req, res) => {
    try {
        console.log("✅ Incoming request to add story");

        const authorId = req.id;
        const image = req.file;

        // Log user ID and file details
        console.log("User ID:", authorId);
        console.log("Received File:", image);

        if (!image) {
            return res.status(400).json({ message: "Please upload an image." });
        }

        // Image processing
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toFormat("jpeg", { quality: 80 })
            .toBuffer();

        // Convert to Data URI
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;

        // Upload to Cloudinary
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        console.log("📸 Image uploaded to Cloudinary:", cloudResponse.secure_url);

        // Save story in database
        const story = await Story.create({
            author: authorId,
            image: cloudResponse.secure_url,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
        });

        console.log("🎉 Story successfully created:", story);

        res.status(201).json({
            message: "Story added successfully",
            success: true,
            story,
        });
    } catch (error) {
        console.log("❌ Error adding story:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// ✅ 2. GET STORIES OF FOLLOWED USERS
export const getUserStories = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate("following");

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Get the user's own stories + followed users' stories in one query
        const stories = await Story.find({
            author: { $in: [...user.following.map(u => u._id), userId] },
            expiresAt: { $gt: new Date() } // Only fetch active stories
        }).populate("author", "username profilePic");

        res.status(200).json({ success: true, stories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ 3. VIEW A STORY (ADD VIEWER)
export const viewStory = async (req, res) => {
    try {
        const storyId = req.params.id;
        const userId = req.id;

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ message: "Story not found", success: false });
        }

        // Add viewer if not already added
        if (!story.views.includes(userId)) {
            story.views.push(userId);
            await story.save();
        }

        res.status(200).json({ message: "Story viewed", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


// ✅ 4. DELETE A STORY
export const deleteStory = async (req, res) => {
    try {
        const storyId = req.params.id;
        const userId = req.id;

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ message: "Story not found", success: false });
        }

        if (story.author.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this story" });
        }

        await Story.findByIdAndDelete(storyId);

        res.status(200).json({ message: "Story deleted", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ 5. GET ALL STORIES
export const getAllStories = async (req, res) => {
    try {
      const stories = await Story.find()
        .populate("author", "username profilePic")
        .sort({ createdAt: -1 });
  
      return res.status(200).json({
        success: true,
        stories,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  