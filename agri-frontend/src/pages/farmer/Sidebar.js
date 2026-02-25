import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";   // 👈 ye add karo

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>🌾 Farmer</h2>
      
      <div><Link to="/farmer-dashboard">Dashboard</Link></div>

      <div><Link to="/farmer/add-product">Add Product</Link></div>

      <div><Link to="/farmer/my-products">My Products</Link></div>

      <div><Link to="/farmer/orders">Orders</Link></div>

      <div><Link to="/farmer/earnings">Earnings</Link></div>
      
      <div><Link to="/farmer/profile">Profile</Link></div>
  </div>
  );
};

export default Sidebar;