import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>🌿 FarmConnect</h2>

      <ul>
        <li><Link to="/farmer-dashboard">Dashboard</Link></li>
        <li><Link to="/my-products">My Products</Link></li>
        <li><Link to="/add-product">Add Product</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/earnings">Earnings</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;