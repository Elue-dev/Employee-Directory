import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredEmployees: [],
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
      const { employees, departments } = action.payload;
      let tempEmployees = [];
      if (departments === "All") {
        tempEmployees = employees;
      } else {
        tempEmployees = employees.filter(
          (post) => post.department === departments
        );
      }
      state.filteredEmployees = tempEmployees;
    },
  },
});

export const { FILTER_BY_NAME, FILTER_BY_DEPARTMENT } = filterSlice.actions;

export const selectFilteredEmployees = (state) =>
  state.filter.filteredEmployees;

export default filterSlice.reducer;
