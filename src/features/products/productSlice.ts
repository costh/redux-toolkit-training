import { createSlice } from "@reduxjs/toolkit";

import type { Product } from "../../app/api";

export interface ProductState {
  products: { [id: string]: Product };
}

const initialState: ProductState = {
  products: {
    "123": {
      name: "fake product",
    },
  },
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
});

export default productsSlice.reducer;
