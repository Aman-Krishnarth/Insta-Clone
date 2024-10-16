import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";

function ChatPage() {
  const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const isOnline = false;

  console.log(suggestedUsers)

  return (
    <div className="flex ml-[16%] h-lvh">
      <section>
        <h1 className="font-bold mb-4 px-3 text-xl"> {user.username} </h1>
        <hr className="mb-4 border-gray-300" />

        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            return (
              <div onClick={()=> dispatch(setSelectedUser(suggestedUser))} className="flex gap-3 items-center p-3 rounded hover:bg-gray-200 cursor-pointer"
              key={suggestedUser._id}
              >
                <Avatar>
                  <AvatarImage src={suggestedUser.profilePicture} />
                  <AvatarFallback>IN</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <span className="font-medium" >{user.username}</span>
                  <span className={`text-sm font-bold ${isOnline ? "text-green-600" : "text-red-600"}`} >{isOnline ? "Online" : "Offline"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default ChatPage;
