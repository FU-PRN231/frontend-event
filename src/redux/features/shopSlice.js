import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shop: null,
};

export const shopSlice = createSlice({
  name: "shop",
  initialState: initialState,
  reducers: {
    setShop: (state, action) => {
      state.shop = action.payload;
    },
  },
});

export const { setShop } = shopSlice.actions;
export default shopSlice.reducer;
