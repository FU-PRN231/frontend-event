import { createSlice } from "@reduxjs/toolkit";

const storedCartList =
  localStorage.getItem("cartList") !== null
    ? JSON.parse(localStorage.getItem("cartList"))
    : [];

const initialState = {
  cartList: storedCartList,
  selectedCoupon: {},
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const productItem = action.payload.productItem;
      const productStock = action.payload.productStock;
      const num = action.payload.num;
      const existingItem = state.cartList.find(
        (item) =>
          item.productStock?.productId === productStock?.productId &&
          ((item.productStock?.clothingSize &&
            item.productStock?.clothingSize === productStock?.clothingSize) ||
            (item.productStock?.shoeSize &&
              item.productStock?.shoeSize === productStock?.shoeSize))
      );
      if (existingItem) {
        state.cartList = state.cartList.map((item) =>
          item.productStock.productId === existingItem.productStock.productId &&
          ((item.productStock.clothingSize &&
            item.productStock.clothingSize ===
              existingItem.productStock.clothingSize) ||
            (item.productStock.shoeSize &&
              item.productStock.shoeSize ===
                existingItem.productStock.shoeSize))
            ? { ...existingItem, quantity: existingItem.quantity + num }
            : item
        );
      } else {
        state.cartList.push({ productItem, productStock, quantity: num });
      }
    },
    decreaseQty: (state, action) => {
      const { productStock } = action.payload;
      const existingItem = state.cartList.find(
        (item) =>
          item.productStock?.productId === productStock?.productId &&
          ((item.productStock?.clothingSize &&
            item.productStock?.clothingSize === productStock?.clothingSize) ||
            (item.productStock?.shoeSize &&
              item.productStock?.shoeSize === productStock?.shoeSize))
      );

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.cartList = state.cartList.filter(
            (item) =>
              item.productStock?.productId !== productStock?.productId ||
              (item.productStock?.clothingSize !== productStock?.clothingSize &&
                item.productStock?.shoeSize !== productStock?.shoeSize)
          );
        } else {
          state.cartList = state.cartList.map((item) =>
            item.productStock.productId ===
              existingItem.productStock.productId &&
            ((item.productStock.clothingSize &&
              item.productStock.clothingSize ===
                existingItem.productStock.clothingSize) ||
              (item.productStock.shoeSize &&
                item.productStock.shoeSize ===
                  existingItem.productStock.shoeSize))
              ? { ...existingItem, quantity: existingItem.quantity - 1 }
              : item
          );
        }
      }
    },
    deleteProduct: (state, action) => {
      const { productStock } = action.payload;
      state.cartList = state.cartList.filter((item) => {
        const isSameProduct =
          item.productStock.productId === productStock.productId;
        const isSameSize =
          (item.productStock.clothingSize &&
            item.productStock.clothingSize === productStock.clothingSize) ||
          (item.productStock.shoeSize &&
            item.productStock.shoeSize === productStock.shoeSize);
        return !isSameProduct || !isSameSize;
      });
    },
    deleteCart: (state) => {
      state.cartList = [];
    },
    applyCoupon: (state, action) => {
      if (state.selectedCoupon.id == action.payload.id) {
        state.selectedCoupon = {};
      } else {
        state.selectedCoupon = action.payload;
      }
    },
  },
});

export const cartMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type?.startsWith("cart/")) {
    const cartList = store.getState().cart.cartList;
    localStorage.setItem("cartList", JSON.stringify(cartList));
  }
  return result;
};

export const {
  addToCart,
  decreaseQty,
  deleteProduct,
  deleteCart,
  applyCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;
