import useGetUserProfile from "@/hooks/useGetUserProfile";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Heart, MessageCircle } from "lucide-react";

function Profile() {
  const params = useParams();
  const userId = params.id;

  useGetUserProfile(userId);
  const { userProfile, user } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState("posts");
  const isLoggedInUser = user.id === userProfile?._id;
  const isFollowing = false;
  const displayedPosts =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  console.log(params);

  console.log(userProfile);
  console.log(user);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10 ">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="">
            <Avatar className="h-36 w-36">
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </section>

          <section className="">
            <div className="flex flex-col gap-5 ">
              <div className="flex items-center gap-3 ">
                <span>{userProfile?.username}</span>

                {isLoggedInUser ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        className="hover:bg-gray-200 h-8 rounded"
                        variant="secondary"
                      >
                        Edit profile
                      </Button>
                    </Link>

                    <Button
                      className="hover:bg-gray-200 h-8 rounded"
                      variant="secondary"
                    >
                      View Archive
                    </Button>
                    <Button
                      className="hover:bg-gray-200 h-8 rounded"
                      variant="secondary"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button className=" h-8  rounded" variant="secondary">
                      Unfollow
                    </Button>
                    <Button className=" h-8  rounded" variant="secondary">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button className="bg-[#0095F6] h-8 hover:bg-[#348dc8] rounded">
                    Follow
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <p>
                  {" "}
                  <span className="font-semibold">
                    {" "}
                    {userProfile?.posts.length}{" "}
                  </span>{" "}
                  posts
                </p>
                <p>
                  {" "}
                  <span className="font-semibold">
                    {" "}
                    {userProfile?.followers.length}{" "}
                  </span>{" "}
                  followers
                </p>
                <p>
                  {" "}
                  <span className="font-semibold">
                    {" "}
                    {userProfile?.following.length}{" "}
                  </span>{" "}
                  following
                </p>
              </div>

              <div>
                <span className="font-semibold"> {userProfile?.bio}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="border-t-2 border-gray-300">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "bookmarks" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("bookmarks")}
            >
              BOOKMARKS
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {displayedPosts?.map((post) => {
              return (
                <div key={post._id} className="relative group cursor-pointer">
                  <img
                    src={post.image}
                    className="rounded my-2 w-full aspect-square object-cover"
                  />

                  <div className="absolute rounded inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
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
}

export default Profile;
