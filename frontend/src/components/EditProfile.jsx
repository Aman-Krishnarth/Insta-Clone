import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

function EditProfile() {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();

  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full">
        <h1 className="font-bold text-xl">Edit Profile</h1>

        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-28 w-28">
              <AvatarImage
                src={user.profilePicture}
                alt="postImage"
                className="w-full h-full"
              />
              <AvatarFallback>IN</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>

              <span className="text-gray-600">
                {user?.bio || "Bio here bro"}
              </span>
            </div>
          </div>

          <input type="file" className="hidden" ref={imageRef} />
          <Button
            className="rounded bg-[#0095F6] h-8 hover:bg-[#318bc7]"
            onClick={() => imageRef.current.click()}
          >
            Change Photo
          </Button>
        </div>

        

      </section>
    </div>
  );
}

export default EditProfile;
