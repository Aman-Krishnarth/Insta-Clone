import React from "react";
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
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { icon: <Home />, text: "Home" },
  { icon: <Search />, text: "Search" },
  { icon: <Compass />, text: "Explore" },
  { icon: <MessageCircle />, text: "Messages" },
  { icon: <Heart />, text: "Notifications" },
  { icon: <PlusSquare />, text: "Create" },
  {
    icon: (
      <Avatar className="w-6 h-6">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    text: "Profile",
  },
  { icon: <LogOut />, text: "Logout" },
];

function LeftSidebar() {
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      await axios
        .get(import.meta.env.VITE_BACKEND_URL + "/user/logout", {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);

          if (res.data.success) {
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
    }
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
                className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 "
                onClick={() => sidebarClickHandler(item)}
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
