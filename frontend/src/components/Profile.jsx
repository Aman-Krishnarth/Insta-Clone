import useGetUserProfile from "@/hooks/useGetUserProfile";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

function Profile() {
  const params = useParams();
  const userId = params.id;
  console.log(userId)

  useGetUserProfile(userId);
  const { userProfile, user } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState("posts");
  const isLoggedInUser = user.id === userProfile?._id;

  const displayedPosts =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;
	
	const dispatch = useDispatch();

	const navigate = useNavigate()

	let isFollowing = false;

	for(let i = 0 ;i<user.following.length; i++){
		if(user.following[i].toString() == userId.toString()){
			isFollowing = true;
			break;	
		}
	}

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const followUnfollowHandler = async () => {
    console.log("request gayi");
    console.log(
      `${import.meta.env.VITE_BACKEND_URL}/user/followOrUnfollow/${userId}`
    );
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/followOrUnfollow/${userId}`,
        {
          withCredentials: true,
        }
      );

      console.log(res);

      if (res.data.success) {
        toast.success(res.data.message);

        dispatch(setAuthUser(res.data.user));
		// window.location.reload()
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const profileMessageHandler = ()=>{

	navigate("/inbox")

  }

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
                    <Button
                      className=" h-8  rounded"
                      variant="secondary"
                      onClick={followUnfollowHandler}
                    >
                      Unfollow
                    </Button>
                    <Button className=" h-8  rounded" variant="secondary"
					onClick={profileMessageHandler}
					>
                      Message
                    </Button>
                  </>
                ) : (
                  <Button
                    className="bg-[#0095F6] h-8 hover:bg-[#348dc8] rounded"
                    onClick={followUnfollowHandler}
                  >
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
