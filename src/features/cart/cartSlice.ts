import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface CartState {
  items: { [productID: string]: number };
}

const initialState: CartState = {
  items: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.items[id]) {
        state.items[id]++;
      } else {
        state.items[id] = 1;
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      delete state.items[action.payload];
    },
  },
});

// Redux automaagically updates this

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;

export function getNumItems(state: RootState) {
  console.log("Calling num items");
  let numItems = 0;
  for (let id in state.cart.items) {
    numItems += state.cart.items[id];
  }
  return numItems;
}

// createSelector was brought in to RTK from the popular reselect library.
// While it's not needed to create selector functions, it makes it a lot easier to create efficient selectors that avoid doing more work than needed.
export const getMemoizedNumItems = createSelector(
  // If items doesn't change in the first argument (state.cart.items) it won't run the computationally
  // heavy selector below where it would compute the numItems
  (state: RootState) => state.cart.items,
  (items) => {
    console.log("calling getMemoizedNumItems");
    let numItems = 0;
    for (let id in items) {
      numItems += items[id];
    }
    return numItems;
  }
);

export const getTotalPrice = createSelector(
  (state: RootState) => state.cart.items,
  (state: RootState) => state.products.products,
  (items, products) => {
    let total = 0;
    for (let id in items) {
      total += products[id].price * items[id];
    }
    return total.toFixed(2);
  }
);
