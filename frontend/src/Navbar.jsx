import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="logo">🚀 FUTURELIST</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        {localStorage.getItem("token") && (
          <li><button onClick={logout}>Logout</button></li>
          
        )}
      </ul>
    </nav>
  );
};
export default Navbar;