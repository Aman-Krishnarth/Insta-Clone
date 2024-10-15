import { setSuggestedUsers, setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

function useGetUserProfile(userId) {
  console.log("aa gaya main");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/${userId}/profile`,
          {
            withCredentials: true,
          }
        );

        console.log(res)

        if (res.data.success) {
          console.log(res.data);
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log("user get all posts try ka catch");
        console.log(error);
      }
    };

    fetchUserProfile();
  }, [userId]);
}

export default useGetUserProfile;
