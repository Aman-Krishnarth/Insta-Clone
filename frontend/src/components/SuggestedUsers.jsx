import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function SuggestedUsers() {
  const { suggestedUsers } = useSelector((store) => store.auth);

  console.log(suggestedUsers);

  return (
    <div className="my-10 bg-blue-400">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See all</span>
      </div>

      {suggestedUsers.map((user) => {
        return (
          <div key={user._id} className="flex items-center justify-between my-5">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user?._id}`}>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt="postImage" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>

              <div>
                <Link to={`/profile/${user?._id}`}>
                  <h1 className="font-semibold text-sm">{user?.username}</h1>
                </Link>

                <span className="text-gray-600 text-sm truncate overflow-hidden whitespace-nowrap">
                  {user?.bio || "Bio here bro"}
                </span>
              </div>
            </div>
			<span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>Follow</span>
          </div>
        );
      })}
    </div>
  );
}

export default SuggestedUsers;
