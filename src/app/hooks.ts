import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";

import type { RootState, AppDispatch } from "./store";

// Rexport type functions to get all the typescript goodness
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
