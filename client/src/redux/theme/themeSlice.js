import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    themeToggler: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const { themeToggler } = themeSlice.actions;

export default themeSlice.reducer;
