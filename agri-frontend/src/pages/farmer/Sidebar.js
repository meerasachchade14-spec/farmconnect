import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">Farmer</h2>

      <ul className="sidebar-menu">
        <li>
          <Link to="">Dashboard</Link>
        </li>

        <li>
          <Link to="add-product">Add Product</Link>
        </li>

        <li>
          <Link to="orders">Orders</Link>
        </li>

        <li>
          <Link to="earnings">Earnings</Link>
        </li>

        <li>
          <Link to="profile">Profile</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
