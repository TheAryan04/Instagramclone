import useGetUserProfile from "@/hooks/useGetUserProfile";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle, X } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");
  const { userProfile, user } = useSelector((store) => store.auth);
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- Add modal state

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = false;
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-50 ">
      <div className="flex flex-col gap-20 py-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
          <div
              className="h-24 w-24 cursor-pointer rounded-full overflow-hidden"
              onClick={() => setIsModalOpen(true)} // <-- Open Modal on Click
            >
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={userProfile?.profilePic}
                  alt="profilePic"
                  className="h-full w-full object-cover"
                />
                <AvatarFallback>
                  {userProfile?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </section>
          <section className="">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="">{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="bg-gray-200 hover:bg-gray-600/10 h-8 rounded-sm font-semibold ml-2 items-center px-2 cursor-pointer"
                      >
                        Edit profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="bg-gray-200 hover:bg-gray-600/10 h-8 rounded-sm font-semibold ml-2 items-center px-2 cursor-pointer"
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="bg-gray-200  h-8 rounded-sm font-semibold ml-2 items-center px-2 cursor-pointer"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button
                      variant="secondary"
                      className="bg-gray-200 h-8 rounded-sm font-semibold ml-2 items-center px-2 cursor-pointer"
                    >
                      Unfollow
                    </Button>
                    <Button
                      variant="secondary"
                      className="bg-[#0095F6] h-8 rounded-sm font-semibold ml-2 items-center px-2 cursor-pointer text-white"
                    >
                      Message
                    </Button>
                  </>
                ) : (
                  <Button className="bg-[#0095F6] hover:bg-[#3192d2] h-8 rounded-sm font-medium ml-2 items-center px-2 text-lg justify-center text-white will-change-auto cursor-pointer">
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p className="">
                  <span className="font-semibold">
                    {userProfile?.posts.length}{" "}
                  </span>
                  Posts
                </p>
                <p className="">
                  <span className="font-semibold">
                    {userProfile?.followers.length}{" "}
                  </span>
                  Followers
                </p>
                <p className="">
                  <span className="font-semibold">
                    {userProfile?.following.length}{" "}
                  </span>
                  Followings
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span>{userProfile?.bio || "bio here"}</span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign className="text-sm" />
                  <span className="-ml-1 ">{userProfile?.username}</span>
                </Badge>
              </div>
            </div>
          </section>
        </div>
        {/* Profile Picture Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-40 group-hover:opacity-100 transaction-opacity duration-300">
            <div className="relative bg-white p-5 rounded-lg">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)} // <-- Close Modal
              >
                <X size={24} />
              </button>
              <img
                src={userProfile?.profilePic}
                alt="profile"
                className="h-96 w-96 object-cover rounded-full"
              />
            </div>
          </div>
        )}
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              onClick={() => handleTabChange("posts")}
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
            >
              POSTS
            </span>
            <span
              onClick={() => handleTabChange("reels")}
              className={`py-3 cursor-pointer ${
                activeTab === "reels" ? "font-bold" : ""
              }`}
            >
              REELS
            </span>
            <span
              onClick={() => handleTabChange("saved")}
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
            >
              SAVED
            </span>
            <span
              onClick={() => handleTabChange("tags")}
              className={`py-3 cursor-pointer ${
                activeTab === "tags" ? "font-bold" : ""
              }`}
            >
              TAGS
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 ">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post?.image}
                    alt="postimage"
                    className="rounded-sm mb-2 w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 bg-opacity-50 opacity-0 group-hover:opacity-100 transaction-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <Button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </Button>
                      <Button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
