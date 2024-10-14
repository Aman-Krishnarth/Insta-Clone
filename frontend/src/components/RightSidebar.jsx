import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function RightSidebar() {
  const { user } = useSelector((store) => store.auth);

  console.log(user);

  return (
    <div className="w-fit my-10 pr-32">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?.id}`}>
          <Avatar>
            <AvatarImage src="{user?.profilePicture}" alt="postImage" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

        <div>
          <Link to={`/profile/${user?.id}`}>
            <h1 className="font-semibold text-sm">{user?.username}</h1>
          </Link>

          <span className="text-gray-600 text-sm">
            {user?.bio || "Bio here bro"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
