import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

function useGetSuggestedUsers() {
  console.log("aa gaya main");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestedUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/suggested`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        console.log(res)

        if (res.data.success) {
          console.log(res.data);
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log("user get all posts try ka catch");
        console.log(error);
      }
    };

    fetchSuggestedUser();
  }, []);
}

export default useGetSuggestedUsers;
