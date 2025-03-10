import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user_routes.js";
import postRoute from "./routes/post_route.js";
import messageRoute from "./routes/message_route.js";
import storyRoute from "./routes/story_routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.get("/", (_,res) => {
    return res.status(200).json({
        msg:"I'm coming from backend",
        success:true
    })
})
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions));

// Allow Preflight Requests for CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

app.use("/api/v2/user", userRoute);
app.use("/api/v2/post", postRoute);
app.use("/api/v2/message", messageRoute);
app.use("/api/v2/stories", storyRoute);

app.listen(PORT, ()=>{
    connectDB();
    console.log(`Server is running on port ${PORT} || 5001`);
})