import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, required: true },
    views: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

const Story = mongoose.model("Story", storySchema);
export { Story };
