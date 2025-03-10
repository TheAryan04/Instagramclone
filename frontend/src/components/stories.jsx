import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import useGetStories from "@/hooks/useGetStories";

const Stories = () => {
  const { stories, loading, setStories } = useGetStories(); // Ensure your hook allows updating stories
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [selectedStory, setSelectedStory] = useState(null);

  // Auto-close story after 5 seconds
  useEffect(() => {
    if (selectedStory) {
      const timer = setTimeout(() => setSelectedStory(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [selectedStory]);

  const handleViewStory = async (story) => {
    try {
      await axios.get(`http://localhost:5000/api/v2/stories/view/${story._id}`, {
        withCredentials: true,
      });
      setSelectedStory(story);
    } catch (error) {
      console.error("Error viewing story:", error);
    }
  };

  const handleDeleteStory = async (storyId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/v2/stories/delete/${storyId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Story deleted successfully");
        setStories((prevStories) => prevStories.filter((s) => s._id !== storyId)); // Remove story from state
      }
    } catch (error) {
      toast.error("Failed to delete story");
    }
  };

  return (
    <div className="my-8 flex space-x-4 w-full mx-auto max-w-sm">
      {loading ? (
        <p>Loading stories...</p>
      ) : stories.length === 0 ? (
        <p>No stories available.</p>
      ) : (
        stories.map((story) => (
          <Dialog key={story._id} open={selectedStory?._id === story._id} onOpenChange={setSelectedStory}>
            <DialogTrigger asChild>
              <div onClick={() => handleViewStory(story)} className="cursor-pointer">
                <Avatar className="w-16 h-16 border-2 border-blue-500">
                  <AvatarImage src={story.author.profilePic} alt="User Story" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
            </DialogTrigger>
            <DialogContent>
              <img src={story.image} alt="Story" className="w-full h-96 object-cover rounded-md" />
              <p className="text-center mt-2">@{story.author.username}</p>
              {user?._id === story.author._id && (
                <button
                  onClick={() => handleDeleteStory(story._id)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              )}
            </DialogContent>
          </Dialog>
        ))
      )}
    </div>
  );
};

export default Stories;
