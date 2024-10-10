import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialogue from "./CommentDialogue";

function Post() {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false)

  const inputChangeHandler = (e)=>{

    const finalText = e.target.value;

    if(finalText.trim()){
        setText(finalText);
    }else{
        setText("")
    }
  }

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt="postImage" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <h1>Username</h1>
        </div>

        <Dialog>
          <DialogTrigger>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>

          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit ">
              Add to favorites
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit ">
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <img
        src="https://plus.unsplash.com/premium_photo-1681666713680-fb39c13070f3?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        className="rounded-sm my-2 w-full aspect-square object-cover"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaRegHeart
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />
          <MessageCircle onClick={()=> setOpen(true)} className="cursor-pointer hover:text-gray-600" />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>

        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>

      <span className="font-semibold block mb-2">143 likes</span>
      <p>
        <span className="font-semibold mr-2">username</span> caption
      </p>
      <span onClick={()=> setOpen(true)} className="cursor-pointer text-gray-600 hover:text-gray-900">View all 10 comments</span>
      <CommentDialogue open={open} setOpen={setOpen}/>

      <div className="flex items-center justifybetween">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full text-wrap h-auto resize-none"
          value={text}
          onChange={inputChangeHandler}
        />

        {text && <span className="text-[#3BADF8]">Post</span>}

        
      </div>
    </div>
  );
}

export default Post;
