import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/homepage/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import EmployeeDetails from "./components/homepage/employee-details/EmployeeDetails";
import Reset from "./components/auth/Reset";

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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
