import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "sonner";

function EditProfile() {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setInput({
        ...input,
        profilePhoto: file,
      });
    }
  };

  const genderChangeHandler = (value) => {
    setInput({
      ...input,
      gender: value,
    });
  };

  const editProfileHandler = async () => {

    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    formData.append("profilePicture", input.profilePhoto);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/profile/edit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?.id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("EDIT PROFILE AXIOS CATCH");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
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
              <h1 className="font-bold text-sm">{user.username}</h1>

              <span className="text-gray-600">
                {user.bio || "Bio here bro"}
              </span>
            </div>
          </div>

          <input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={fileChangeHandler}
          />
          <Button
            className="rounded bg-[#0095F6] h-8 hover:bg-[#318bc7]"
            onClick={() => imageRef.current.click()}
          >
            Change Photo
          </Button>
        </div>

        <div>
          <h1 className="text-xl font-bold mb-2">Bio</h1>
          <Textarea
            className="rounded focus-visible:ring-transparent"
            name="bio"
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
          />
        </div>

        <div>
          <h1 className="text-lg font-bold mb-2">Gender</h1>

          <Select
            className="rounded"
            defaultValue={input.gender}
            onValueChange={genderChangeHandler}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          {loading ? (
            <Button className="w-fit rounded bg-[#0095F6]  hover:bg-[#318bc7]">
              <Loader2 className="animate-spin mr-2" />
              Please Wait...
            </Button>
          ) : (
            <Button
              className="w-fit rounded bg-[#0095F6]  hover:bg-[#318bc7]"
              onClick={editProfileHandler}
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

export default EditProfile;
