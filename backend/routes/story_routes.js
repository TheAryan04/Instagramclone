import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";
import { 
    addStory, 
    getAllStories, 
    getUserStories, 
    deleteStory, 
    viewStory
} from "../controllers/story_controller.js";

const router = express.Router();

router.route("/addstory").post(isAuthenticated, upload.single('image'), addStory);
router.route("/all").get(isAuthenticated, getAllStories);
router.route("/userstories/all").get(isAuthenticated, getUserStories);
router.route("/view/:id").get(isAuthenticated, viewStory);
router.route("/delete/:id").delete(isAuthenticated, deleteStory);

export default router;
