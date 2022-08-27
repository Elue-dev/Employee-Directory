import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./navbar.scss";

export default function Navbar({ setInfo }) {
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
        <Link to="/">
          {" "}
          <h3>Employee Directory</h3>
        </Link>
        <div className="right__contents">
          <button onClick={() => setInfo(true)}>INFO</button>
          <button onClick={logOutUser}>LOGOUT</button>
        </div>
      </div>
    </div>
  );
}
