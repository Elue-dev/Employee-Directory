import { configureStore, combineReducers } from "@reduxjs/toolkit";
import filterReducer from "./filterSlice";
import expenseReducer from "./expenseSlice";

const rootReducer = combineReducers({
  filter: filterReducer,
  expense: expenseReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
