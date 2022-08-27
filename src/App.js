import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/homepage/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import EmployeeDetails from "./components/homepage/employee-details/EmployeeDetails";
import Reset from "./components/auth/Reset";
import EmployeeExpenses from "./pages/employee-expenses/EmployeeExpenses";
import ExpenseForm from "./pages/employee-expenses/expense-form/ExpenseForm";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            exact
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/employee/:name/:id" element={<EmployeeDetails />} />
          <Route path="/employee-expenses" element={<EmployeeExpenses />} />
          <Route path="/expense-form/:id" element={<ExpenseForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
