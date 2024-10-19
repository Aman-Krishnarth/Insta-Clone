import Login from "./components/Login";
import Signup from "./components/Signup";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/notificationSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes> ,
    children: [
      {
        path: "/",
        element:<ProtectedRoutes> <Home /></ProtectedRoutes>,
      },
      {
        path: "/profile/:id",
        element:<ProtectedRoutes><Profile /></ProtectedRoutes> ,
      },
      {
        path: "/account/edit",
        element:<ProtectedRoutes><EditProfile /></ProtectedRoutes> ,
      },
      {
        path: "/inbox",
        element:<ProtectedRoutes> <ChatPage /></ProtectedRoutes> ,
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
    element:<Login/>,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const {onlineUsers} = useSelector((store)=> store.chat)
  const {socketio} = useSelector(store=> store.socketio)
  const dispatch = useDispatch();

  console.log(onlineUsers)

  useEffect(() => {
    if (user) {
      const socketio = io("https://insta-clone-backend-eyms.onrender.com", {
        query: {
          userId: user?.id,
        },
        transports: ["websocket"],
      });
      console.log(socketio)
      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification)=>{
        // console.log(notification)
        console.log("----------------------------")
        dispatch(setLikeNotification(notification))
      })

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else {
      socketio?.close()
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
