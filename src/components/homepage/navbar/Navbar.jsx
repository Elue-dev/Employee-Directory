import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./navbar.scss";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const logOutUser = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="navbar">
      <div className="navbar__contents">
        <h3>Employee Directory</h3>
        <div className="right__contents">
          <button>INFO</button>
          <button onClick={logOutUser}>LOGOUT</button>
        </div>
      </div>
    </div>
  );
}
