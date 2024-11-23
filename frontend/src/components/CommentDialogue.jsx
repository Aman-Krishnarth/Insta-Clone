import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

function CommentDialogue({ open, setOpen }) {
  console.log("comment dialogue mein hu brother");

  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [comment, setComment] = useState([])
  console.log(selectedPost);

  useEffect(()=>{
    if(selectedPost){
      console.log("use effect se selected post")
      console.log(selectedPost)
      setComment(selectedPost.comments)
    }
  },[selectedPost])

  const changeEventHandler = (e) => {
    const inputText = e.target.value;

    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/post/${selectedPost._id}/comment`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} className="">
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="p-0 max-w-[80%] h-[80%]"
      >
        <div className="flex flex-col md:flex-row overflow-auto">
          <div className="w-full md:w-1/2 h-full">
            <img
              src={selectedPost?.image}
              className="h-full w-full object-contain rounded-l-lg bg-slate-300"
              alt=""
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-between p-2 ">
            <div className="flex items-center justify-between p-4  border-b border-b-gray-400">
              <div className="flex gap-3 items-center ">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>

                <div>
                  <Link className="font-semibold text-xs ">
                    {selectedPost?.author?.username}
                  </Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>

                <DialogContent className="flex flex-col items-center text-sm text-center ">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full ">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex-1 overflow-y-auto p-2 ">
              {comment.map((comment) => {
                return <Comment key={comment._id} comment={comment} />;
              })}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full outline-none border border-gray-300 p-2 rounded"
                onChange={changeEventHandler}
                value={text}
              />
              <Button
                variant="outline"
                onClick={sendMessageHandler}
                disabled={!text.trim()}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialogue;
