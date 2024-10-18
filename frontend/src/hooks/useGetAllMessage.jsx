import { setMessages } from "@/redux/chatSlice";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function useGetAllMessage() {
  console.log("aa gaya main");
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
            withCredentials: true,
          }
        );

        console.log(res);

        if (res.data.success) {
          console.log(res.data);
          dispatch(setMessages(res.data.messages))
        }
      } catch (error) {
        console.log("user get all posts try ka catch");
        console.log(error);
      }
    };

    fetchAllMessage();
  }, [selectedUser]);
}

export default useGetAllMessage;
