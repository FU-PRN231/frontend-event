import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import cartReducer from './features/cartSlice';

const rootReducer = combineReducers({
  user: authReducer,
  cart: cartReducer,

});

export default rootReducer;
