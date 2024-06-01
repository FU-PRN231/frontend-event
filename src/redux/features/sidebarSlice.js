import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isOpen: true,
};
export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
