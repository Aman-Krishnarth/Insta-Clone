import useGetUserProfile from "@/hooks/useGetUserProfile";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

function Profile() {
  const params = useParams();
  const userId = params.id;

  useGetUserProfile(userId);

  console.log(params);

  const { userProfile } = useSelector((store) => store.auth);
  console.log(userProfile);

  const isLoggedInUser = true;
  const isFollowing = false;

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10 ">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="">
            <Avatar className="h-36 w-36">
              <AvatarImage src={userProfile.profilePicture} />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </section>

          <section className="">
            <div className="flex flex-col gap-5 ">
              <div className="flex items-center gap-3 ">
                <span>{userProfile.username}</span>

                {isLoggedInUser ? (
                  <>
                    <Button
                      className="hover:bg-gray-200 h-8 rounded"
                      variant="secondary"
                    >
                      Edit profile
                    </Button>
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
                    {userProfile.posts.length}{" "}
                  </span>{" "}
                  posts
                </p>
                <p>
                  {" "}
                  <span className="font-semibold">
                    {" "}
                    {userProfile.followers.length}{" "}
                  </span>{" "}
                  followers
                </p>
                <p>
                  {" "}
                  <span className="font-semibold">
                    {" "}
                    {userProfile.following.length}{" "}
                  </span>{" "}
                  following
                </p>
              </div>

              <div>
                <span className="font-semibold"> {userProfile.bio}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="border-t-2 border-gray-300">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span className="py-3 cursor-pointer">POSTS</span>
            <span className="py-3 cursor-pointer">BOOKMARKS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
