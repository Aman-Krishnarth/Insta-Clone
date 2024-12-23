import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

function userGetAllPosts() {
  console.log("aa gaya main");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPost = async () => {
      console.log("fetch all post mein hu")
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/post/all`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        console.log(res)

        if (res.data.success) {
          console.log(res.data);
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.log("user get all posts try ka catch");
        console.log(error);
      }
    };

    fetchAllPost();
  }, []);
}

export default userGetAllPosts;
