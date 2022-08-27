import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expenses: [],
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    STORE_EXPENSES: (state, action) => {
      state.expenses = action.payload.expenses;
    },
  },
});

export const { STORE_EXPENSES } = expenseSlice.actions;

export const selectExpenses = (state) => state.expense.expenses;

export default expenseSlice.reducer;
