import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./features/cartSlice";
import sidebarReducer from "./features/sidebarSlice";
import authReducer from "./features/authSlice";
import shopReducer from "./features/shopSlice";

const rootReducer = combineReducers({
  user: authReducer,
  cart: cartReducer,
  sidebar: sidebarReducer,
  shop: shopReducer,
});

export default rootReducer;
