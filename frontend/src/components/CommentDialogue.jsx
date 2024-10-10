import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";

function CommentDialogue({ open, setOpen }) {
  return (
    <Dialog open={open} className="">
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="p-0 "
      >
        <div className="flex flex-1">
          <div className="w-1/2 h-full ">
            <img
              src="https://plus.unsplash.com/premium_photo-1681666713680-fb39c13070f3?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="h-full w-full object-cover rounded-l-lg"
              alt=""
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between ">
            <div className="flex items-center justify-between p-4  border-b border-b-gray-400">
              <div className="flex gap-3 items-center ">
                <Link>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>

                <div>
                  <Link className="font-semibold text-xs ">username</Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer"/>
                </DialogTrigger>

                <DialogContent className="flex flex-col items-center text-sm text-center ">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">Unfollow</div>
                  <div className="cursor-pointer w-full ">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex-1 overflow-y-auto max-h-96 p-4">
                comments
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialogue;
