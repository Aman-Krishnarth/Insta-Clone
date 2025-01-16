import Login from "./components/Login";
import Signup from "./components/Signup";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/notificationSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";
import axios from "axios";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            {" "}
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/account/edit",
        element: (
          <ProtectedRoutes>
            <EditProfile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/inbox",
        element: (
          <ProtectedRoutes>
            {" "}
            <ChatPage />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "*",
    element: <Login />,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const { onlineUsers } = useSelector((store) => store.chat);
  const { socketio } = useSelector((store) => store.socketio);
  const [showLoading, setShowLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io("https://insta-clone-backend-eyms.onrender.com", {
        query: {
          userId: user?.id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        console.log("----------------------------");
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else {
      socketio?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  useEffect(() => {
    const activateApis = async () => {
      setShowLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/logout`
      );
      setShowLoading(false);
    };

    activateApis();
  }, []);

  return (
    <>
      {showLoading ? (
        <div className="flex flex-col h-screen w-screen items-center justify-center">
          <button
            type="button"
            className="flex items-center rounded-lg bg-green-700 px-4 py-2 text-white"
            disabled
          >
            <svg
              className="mr-3 h-7 w-7 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="font-medium text-3xl"> Loading... </span>
          </button>
          <p className="text-[red] text-center text-xl">
            Hang tight! This might take 20-25 seconds to load. Your patience is
            appreciated!
          </p>
        </div>
      ) : (
        <RouterProvider router={router} />
      )}
    </>
  );
}

export default App;
