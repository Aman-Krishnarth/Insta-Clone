import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { convertToUrl } from "@/lib/utils";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

function CreatePost({ open, setOpen }) {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/post/addPost`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        dispatch(setPosts([res.data.createdPost, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
        setFile("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  async function fileChangeHandler(e) {
    const file = e.target.files?.[0];

    if (file) {
      setFile(file);
      const fileUrl = await convertToUrl(file);
      setImagePreview(fileUrl);
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-bold">
          Create Post
        </DialogHeader>

        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-base">{user?.username}</h1>
            <span className="text-base text-gray-600">{user?.bio}</span>
          </div>
        </div>

        <Textarea
          className="focus-visible:ring-transparent border-none"
          placeholder="Write caption for your post..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {imagePreview && (
          <div className="h-64 w-full flex items-center justify-center">
            <img
              src={imagePreview}
              alt="Image Preview"
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}

        <input
          type="file"
          className="hidden"
          ref={imageRef}
          onChange={fileChangeHandler}
        />

        <Button
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] rounded hover:rounded-3xl transition-all duration-300 ease-in-out"
          onClick={() => imageRef.current.click()}
        >
          Select Attachments
        </Button>

        {imagePreview &&
          (loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </Button>
          ) : (
            <Button
              type="button"
              className="w-full"
              onClick={createPostHandler}
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
