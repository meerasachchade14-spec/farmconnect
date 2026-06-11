import React from "react";
import { Link } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar() {
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

    </div>
  );
}

export default AdminSidebar;
