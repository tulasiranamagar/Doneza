import { createSlice } from "@reduxjs/toolkit";

const savedToken = localStorage.getItem("doneza_token");
const savedUser = localStorage.getItem("doneza_user");

const initialState = {
  token: savedToken || null,
  user: savedUser ? JSON.parse(savedUser) : null,
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem("doneza_token", action.payload.token);
      localStorage.setItem(
        "doneza_user",
        JSON.stringify(action.payload.user)
      );
    },

    logout: (state) => {
      state.token = null;
      state.user = null;

      localStorage.removeItem("doneza_token");
      localStorage.removeItem("doneza_user");
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;