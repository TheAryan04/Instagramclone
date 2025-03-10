import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async (postId) => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:5000/api/v2/post/${postId}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // apne post ko update krunga
        const updatedPostedData = posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostedData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v2/post/${post?._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostedData = posts.map((p) =>
          p._id === post?._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostedData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v2/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostedData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostedData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="my-8 w-full mx-auto max-w-sm">
      <div className="flex items-center justify-between">
        <Link to={`/profile/${post.author?.[0]?._id}`}>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={post.author?.[0]?.profilePic} alt="post_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-3">
              <h1>{post.author?.[0]?.username}</h1>
              {user?._id === post?.author?.[0]?._id && <Badge variant="secondary">Author</Badge>}
            </div>
          </div>
        </Link>
        <Dialog className="">
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col w-full text-sm text-center">
            <button className="cursor-pointer text-[#ED4956] font-bold hover:bg-gray-200 hover:text-primary/90 transition-colors ">
              Unfollow
            </button>
            <button className="cursor-pointer hover:bg-gray-200 transition-colors">
              Add to favorites
            </button>
            {/* {console.log("User ID:", user?._id, "Post Author ID:", post?.author?._id)} */}
            {user && post?.author?.[0]?._id === user._id && (
              <button
                onClick={deletePostHandler}
                className="cursor-pointer hover:bg-gray-200 transition-colors"
              >
                Delete
              </button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover cursor-pointer"
        src={post?.image}
        alt="post_img"
      />
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              onClick={() => likeOrDislikeHandler(post._id)}
              size={"22"}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={() => likeOrDislikeHandler(post._id)}
              size={"22px"}
              className="cursor-pointer hover:text-gray-600"
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setShowCommentDialog(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2 cursor-pointer">
        {postLike} likes
      </span>
      <Link to={`/profile/${post.author?.[0]?._id}`}>
        <p>
          <span className="font-medium mr-2 cursor-pointer">{post.author?.[0]?.username}</span>
          {post.caption}
        </p>    
      </Link>
      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setShowCommentDialog(true);
          }}
          className="cursor-pointer text-sm text-gray-400"
        >
          View all {comment.length} comments
        </span>
      )}
      <CommentDialog
        showCommentDialog={showCommentDialog}
        setShowCommentDialog={setShowCommentDialog}
      />
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
