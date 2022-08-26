import { configureStore, combineReducers } from "@reduxjs/toolkit";
import filterReducer from "./filterSlice";

const rootReducer = combineReducers({
  filter: filterReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
