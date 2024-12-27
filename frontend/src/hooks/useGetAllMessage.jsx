import { setMessages } from "@/redux/chatSlice";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function useGetAllMessage() {
  const dispatch = useDispatch();

  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/message/all/${
            selectedUser?._id
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (res.data.success) {
          dispatch(setMessages(res.data.messages))
        }
      } catch (error) {
        console.log("user get all posts try ka catch".toUpperCase());
      }
    };

    fetchAllMessage();
  }, [selectedUser]);
}

export default useGetAllMessage;
