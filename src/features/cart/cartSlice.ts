import {
  createSlice,
  PayloadAction,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { CartItems, checkout } from "../../app/api";

import { AppDispatch, RootState } from "../../app/store";

type CheckoutState = "LOADING" | "READY" | "ERROR";

export interface CartState {
  items: { [productID: string]: number };
  checkoutState: CheckoutState;
  errorMessage: string;
}

const initialState: CartState = {
  items: {},
  checkoutState: "READY",
  errorMessage: "",
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
    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const { id, quantity } = action.payload;
      state.items[id] = quantity;
    },
  },
  // To handle arbitrary actions in our slice, we use the extraReducers property and the Builder API which provides a way to define cases for the reducer to handle without using the switch statement,
  extraReducers: function (builder) {
    builder.addCase(checkoutCart.pending, (state) => {
      state.checkoutState = "LOADING";
    });
    builder.addCase(
      checkoutCart.fulfilled,
      (state, action: PayloadAction<{ success: boolean }>) => {
        const { success } = action.payload;
        if (success) {
          state.checkoutState = "READY";
          state.items = {};
        } else {
          state.checkoutState = "ERROR";
        }
      }
    );
    // Rejected thunk has special property in the action with the rejected state from server
    builder.addCase(checkoutCart.rejected, (state, action) => {
      state.checkoutState = "ERROR";
      state.errorMessage = action.error.message || "";
    });
  },
});

// Async thunk automatically generates actions for pending fulfilled and rejected and can be used
// in extra reducers
export const checkoutCart = createAsyncThunk(
  "cart/checkout",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const items = state.cart.items;
    const response = await checkout(items);
    return response;
  }
);

// Redux automaagically updates this

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;

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
