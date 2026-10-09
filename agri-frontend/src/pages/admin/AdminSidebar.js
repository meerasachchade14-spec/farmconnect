import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  return (
    <div className="admin-sidebar">

      <h2 className="admin-sidebar-logo">Admin Panel</h2>

      <ul className="admin-sidebar-menu">

        <li>
          <Link to="/admin-dashboard">Dashboard</Link>
        </li>

        <li>
          <Link to="/admin-dashboard/farmers">Farmers</Link>
        </li>

        <li>
          <Link to="/admin-dashboard/buyers">Buyers</Link>
        </li>

        <li>
          <Link to="/admin-dashboard/products">Products</Link>
        </li>

      </ul>

      <div style={{ marginTop: "auto", padding: "20px" }}>
        <button 
          onClick={handleLogout} 
          style={{ width: "100%", padding: "10px", backgroundColor: "#e74c3c", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
        >
          Logout
        </button>
      </div>

    </div>
  );
}

export default AdminSidebar;
