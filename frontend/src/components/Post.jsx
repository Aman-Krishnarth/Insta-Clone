import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  Bookmark,
  MessageCircle,
  MoreHorizontal,
  Send,
  BookmarkCheck,
} from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialogue from "./CommentDialogue";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Link } from "react-router-dom";

function Post({ post }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?.id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const inputChangeHandler = (e) => {
    const finalText = e.target.value;

    if (finalText.trim()) {
      setText(finalText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/post/${post._id}/${
          liked ? "dislike" : "like"
        }`,
        { withCredentials: true }
      );

      console.log(res);

      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user.id)
                  : [...p.likes, user.id],
              }
            : p
        );
        console.log("UPDATED POST DATA");
        console.log(updatedPostData)
        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
      }
    } catch (error) {}
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/post/delete/${post._id}`,
        { withCredentials: true }
      );

      console.log(res);
      if (res.data.success) {
        window.location.reload();
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "😕 Whoops! Something went sideways...🌊 Chill for a bit and try again later! "
      );
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/post/${post._id}/comment`,
        { text },
        {
          withCredentials: true,
        }
      );

      console.log(res);

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bookmarkHandler = async () => {
    console.log("book mark handler mein hu".toUpperCase());
    console.log(
      `${import.meta.env.VITE_BACKEND_URL}/post/${post._id}/bookmark`
    );

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/post/${post._id}/bookmark`,
        {
          withCredentials: true,
        }
      );

      console.log(res);

      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("POST SE");
  console.log(user);
  console.log(post);

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="postImage" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <Link to={`/profile/${post.author._id}`}>
            <h1>{post.author?.username}</h1>
          </Link>
        </div>

        <Dialog>
          <DialogTrigger>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>

          <DialogContent className="flex flex-col items-center text-sm text-center">
            {post.author._id !== user?.id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )}
            <Button variant="ghost" className="cursor-pointer w-fit ">
              Add to favorites
            </Button>
            {user && user?.id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit "
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <img
        src={post.image}
        alt=""
        className="rounded my-2 w-full aspect-square object-contain bg-slate-200"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              size={"22px"}
              className="cursor-pointer text-red-600"
              onClick={likeOrDislikeHandler}
            />
          ) : (
            <FaRegHeart
              size={"22px"}
              className="cursor-pointer hover:text-gray-600"
              onClick={likeOrDislikeHandler}
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>

        {post.author?.bookmarks?.includes(post._id) ? (
          <BookmarkCheck
            onClick={bookmarkHandler}
            className="cursor-pointer hover:text-gray-600"
          />
        ) : (
          <Bookmark
            onClick={bookmarkHandler}
            className="cursor-pointer hover:text-gray-600"
          />
        )}
      </div>

      <span className="font-semibold block mb-2">{postLike} Likes</span>
      <p>
        <span className="font-semibold mr-2">{post.author?.username}</span>{" "}
        {post.caption}
      </p>
      <span
        onClick={() => {
          dispatch(setSelectedPost(post));
          setOpen(true);
        }}
        className="cursor-pointer text-gray-600 hover:text-gray-900"
      >
        {comment.length ? "View All comments" : "No comments yet"}
      </span>
      <CommentDialogue open={open} setOpen={setOpen} />

      <div className="flex items-center justifybetween">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full text-wrap h-auto resize-none"
          value={text}
          onChange={inputChangeHandler}
        />

        {text && (
          <span
            className="text-[#3BADF8] cursor-pointer"
            onClick={commentHandler}
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Post;
