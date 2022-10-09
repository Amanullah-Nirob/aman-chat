import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../../store"; 



const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedInUser: {
      _id: "",
      name: "",
      email: "",
      all:null,
      notifications: [],
      cloudinary_id: "",
      profilePic: "",
      token: "",
      expiryTime: null
    },
  },
  reducers: {
    setLoggedInUser: (state, action) => {
        state.loggedInUser = action.payload;
    },
  },
});

export const { setLoggedInUser } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth?.loggedInUser;
