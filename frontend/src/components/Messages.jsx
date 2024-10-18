import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetMessages from "@/hooks/useGetMessages";

function Messages({ selectedUser }) {
  useGetMessages()
  useGetAllMessage();
  const {user} = useSelector(store => store.auth)
  const { messages } = useSelector((store) => store.chat);

  const messageContainerRef = useRef()

  useEffect(()=>{

    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: 'smooth', // Optional for smooth scrolling
      });
    }
    
  },[messages])

  return (
    <div className="overflow-y-auto flex-1 p-4" ref={messageContainerRef}>
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar>
            <AvatarImage src={selectedUser.profilePicture} />
            <AvatarFallback>IN</AvatarFallback>
          </Avatar>
          <span>{selectedUser.username}</span>
          <Link to={`/profile/${selectedUser._id}`}>
            {" "}
            <Button className="h-8 my-2" variant="secondary">
              View Profile
            </Button>{" "}
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg) => {
            return (
              <div className={`flex ${user?.id === msg.senderId ? "justify-end" : "justify-start"} `} key={msg._id}>
                <div
                className={`py-2 px-3 rounded-xl max-w-xs break-words ${msg.senderId === user?.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                >{msg.message}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Messages;
