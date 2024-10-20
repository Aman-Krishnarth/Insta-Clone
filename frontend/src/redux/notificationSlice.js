import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    likeNotification: [],
    followNotification: []
  },
  reducers: {
    setLikeNotification: (state, action) => {
      console.log("notification slice mein hu");

      console.log(action.payload)

      if (action.payload.type === "like") {
        state.likeNotification.push(action.payload);
      } else if (action.payload.type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },
    setFollowNotification: (state,action) => {
      console.log(action.payload)
      state.followNotification = action.payload
    }
  },
});

export const { setLikeNotification,setFollowNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
