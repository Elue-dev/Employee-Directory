import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredEmployees: [],
  filteredExpenses: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_BY_NAME: (state, action) => {
      const { employees, search } = action.payload;

      let tempEmployees = employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(search.toLowerCase()) ||
          employee.location.toLowerCase().includes(search.toLowerCase())
      );
      state.filteredEmployees = tempEmployees;
    },
    FILTER_BY_DEPARTMENT: (state, action) => {
      const { employees, depts } = action.payload;
      let tempEmployees = [];
      if (depts === "All") {
        tempEmployees = employees;
      } else {
        tempEmployees = employees.filter((post) => post.department === depts);
      }
      state.filteredEmployees = tempEmployees;
    },
    FILTER_BY_MERCHANT: (state, action) => {
      const { expenses, merchants } = action.payload;
      let tempExpenses = [];
      if (merchants === "All") {
        tempExpenses = expenses;
      } else {
        tempExpenses = expenses.filter((post) => post.merchant === merchants);
      }
      state.filteredExpenses = tempExpenses;
    },
    SORT_EXPENSES: (state, action) => {
      const { expenses, sort } = action.payload;

      let tempExpenses = [];
      if (sort === "Default") {
        tempExpenses = expenses;
      }
      if (sort === "Lowest Total") {
        tempExpenses = expenses.slice().sort((a, b) => {
          return a.amount - b.amount;
        });
      }
      if (sort === "Highest Total") {
        tempExpenses = expenses.slice().sort((a, b) => {
          return b.amount - a.amount;
        });
      }
      if (sort === "New") {
        tempExpenses = expenses.filter((product) => product.status === "New");
      }
      if (sort === "Processing") {
        tempExpenses = expenses.filter(
          (product) => product.status === "Processing"
        );
      }
      if (sort === "Reinbursed") {
        tempExpenses = expenses.filter(
          (product) => product.status === "Reinbursed"
        );
      }

      state.filteredExpenses = tempExpenses;
    },
  },
});

export const {
  FILTER_BY_NAME,
  FILTER_BY_DEPARTMENT,
  FILTER_BY_MERCHANT,
  SORT_EXPENSES,
} = filterSlice.actions;

export const selectFilteredEmployees = (state) =>
  state.filter.filteredEmployees;
export const selectFilteredExpenses = (state) => state.filter.filteredExpenses;

export default filterSlice.reducer;
