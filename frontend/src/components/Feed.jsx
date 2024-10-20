import React from "react";
import Posts from "./Posts";

function Feed() {
  return (
    <div className=" flex-1 my-8 flex flex-col justify-center lg:justify-normal items-center sm:pl-[20%]">
      <Posts />
    </div>
  );
}

export default Feed;
