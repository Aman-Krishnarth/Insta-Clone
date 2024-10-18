import React, { useState } from "react";
import {
  Heart,
  Home,
  MessageCircle,
  PlusSquare,
  Search,
  LogOut,
  Compass,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { setLikeNotification } from "@/redux/notificationSlice";

function LeftSidebar() {
  const navigate = useNavigate();

  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.notification);

  console.log(likeNotification);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <Compass />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  const logoutUser = async () => {
    try {
      await axios
        .get(import.meta.env.VITE_BACKEND_URL + "/user/logout", {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);

          if (res.data.success) {
            dispatch(setAuthUser(null));
            toast.success(res.data.message);
            navigate("/login");
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log("sidebar logout user AXIOS catch");
        });
    } catch (error) {
      console.log("LEFTSIDEBAR LOGOUT USER CATCH");
    }
  };

  function sidebarClickHandler(item) {
    if (item.text === "Logout") {
      logoutUser();
    } else if (item.text === "Create") {
      setOpen(true);
    } else if (item.text === "Profile") {
      navigate(`/profile/${user.id}`);
    } else if (item.text === "Home") {
      navigate(`/`);
    } else if (item.text === "Messages") {
      navigate(`/inbox`);
    }
  }

  function handleNotificationIconClick(){
	console.log("main click hua hu bitch".toUpperCase())
	// dispatch(setLikeNotification({
  //   type: "like"
  // }))
  }

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-center gap-2 relative hover:bg-gray-200 cursor-pointer rounded-xl p-3 my-3 hover:scale-105 duration-300 ease-in-out"
                onClick={() => sidebarClickHandler(item)}
              >
                {item.icon}
                <span>{item.text}</span>

                {item.text === "Notifications" &&
                  likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild onClick={handleNotificationIconClick}>
                        <Button
                          size="icon"
                          className="rounded-full h-5 w-5 absolute bottom-6 left-6 bg-red-600 hover:bg-red-600"
                        >
                          {likeNotification.length}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent>
                        <div>
                          {likeNotification.length === 0 ? (
                            <p>NO new notification</p>
                          ) : (
                            likeNotification.map((notif) => {
                              console.log(notif);
                              return (
                                <div
                                  key={notif.userId}
                                  className=" flex items-center gap-2 p-2 my-2"
                                >
                                  <Avatar>
                                    <AvatarImage
                                      src={notif.userDetails.profilePicture}
                                    />
                                  </Avatar>
                                  <p className="text-base">
                                    <Link
                                      to={`/profile/${notif.userDetails._id}`}
                                    >
                                      <span className="font-bold hover:underline">
                                        {notif.userDetails.username}
                                      </span>
                                    </Link>{" "}
                                    liked your post!
                                  </p>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
              </div>
            );
          })}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
}

export default LeftSidebar;
