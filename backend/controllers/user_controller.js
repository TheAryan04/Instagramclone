import {User} from "../models/user_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { Post } from "../models/post_model.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if(!username || !email || !password){
            return res.status(401).json({ message: "Please fill in all fields", 
            success:false, 
            });
        }
        const user = await User.findOne({ email });
        if(user){
            return res.status(401).json({ message: "Email already exists",
            success:false,
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).json({ 
            message: "User created successfully",
            success:true,
        });
    } catch (error) {
        console.log(error);
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(401).json({ message: "Please fill in all fields",
            success:false,
            });
        };
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({ message: "Invalid email or password",
            success:false,
            });
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(401).json({ message: "Invalid email or password",
            success:false,
            });
        };

        
        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        //populate each post if in the posts array
        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post && Array.isArray(post.author) && post.author.length > 0) {
                    const authorUsername = post.author[0].username; // Get username from first author
                    return {
                        ...post._doc, // Spread post data
                        authorUsername, // Add username separately
                    };
                }
                return null;  // Return null for posts that do not exist or do not belong to the user
            })
        );
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic:user.profilePic,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:populatedPosts
        };
        return res.cookie('token', token, {httpOnly:true, sameSite:'strict', maxAge: 1*24*60*60*1000}).json({
            message: `Logged in successfully ${user.username}`,
            success:true,
            token,
            user,
        });
    } catch (error) {
        console.log(error);
    }
};
export const logout = async(_,res) => {
    try {
        return res.cookie("token","", {maxAge:0}).json({
            message: "Logged out successfully",
            success:true
        });
    } catch (error) {
        console.log(error);
    }
};
export const getProfile = async(req,res) =>{
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks').select("-password");
        return res.status(200).json({
            user,
            success:true
        });
    } catch (error) {
        console.log(error);
    }
};
export const editProfile = async(req,res) =>{
    try {
        const userId = req.id;
        console.log('User ID:', userId); // Log the userId
        const {gender, bio} = req.body;
        const profilePic = req.file;
        let cloudResponse;

        if(profilePic){
            const fileUri = getDataUri(req.file);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({
                message: "User not found",
                success:false
            });
        };
        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(cloudResponse && cloudResponse.secure_url) user.profilePic = cloudResponse.secure_url;
        await user.save(); // Save the updated user

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user, // Returning updated user
        });
        
    } catch (error) {
        console.log(error);
    }
};
export const getSuggestedUsers = async (req,res) =>{
    try {
        const userId = req.id; // Assuming userId is coming from the auth middleware
        
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const objectId =new mongoose.Types.ObjectId(userId); // Convert to ObjectId
        const getSuggestedUsers = await User.find({_id:{$ne:objectId}}).select("-password");
        return res.status(200).json({
            message: "Suggested users fetched successfully",
            users: getSuggestedUsers,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};
export const followOrUnfollow = async (req, res) =>{
    try {
        const followKrnewala = req.id;
        const jiskoFollowKrunga = req.params.id;
        if(followKrnewala === jiskoFollowKrunga){
            return res.status(400).json({
                message: "You can't follow yourself",
                success:false
            });
        }
        const user = await User.findById(followKrnewala);
        const targetUser = await User.findById(jiskoFollowKrunga);
        if(!user || !targetUser){
            return res.status(404).json({
                message: "User not found",
                success:false
            });
        }
        //mai check karunga ki follow krna hai ya unfollow
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if(isFollowing){
            //unfollow logic
            await Promise.all([
                User.updateOne({_id:followKrnewala},{$pull: {following:jiskoFollowKrunga}}),
                User.updateOne({_id:jiskoFollowKrunga},{$pull: {followers:followKrnewala}})
            ])
            return res.status(200).json({
                message: "Unfollowed successfully",
                success:true
            });
        }else{
            //follow logic
            await Promise.all([
                User.updateOne({_id:followKrnewala},{$push: {following:jiskoFollowKrunga}}),
                User.updateOne({_id:jiskoFollowKrunga},{$push: {followers:followKrnewala}})
            ]);
            return res.status(200).json({
                message: "Followed successfully",
                success:true
            });
        }

    } catch (error) {
        console.log(error);
    }
};