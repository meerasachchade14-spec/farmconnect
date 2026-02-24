import React from "react";
import { Link } from "react-router-dom";
import "./buyer.css";

function MyOrders() {
  return (
    <div className="dashboard-container">
      <div className="buyer-sidebar">
        <h2>FarmConnect</h2>
        <Link to="/buyer">Dashboard</Link>
        <Link to="/buyer/browse">Browse Crops</Link>
        <Link to="/buyer/orders">My Orders</Link>
        <Link to="/buyer/wishlist">Wishlist</Link>
        <Link to="/buyer/profile">Profile</Link>
      </div>

      <div className="buyer-main">
        <div className="topbar">
          <h3>My Orders</h3>
        </div>

        <div className="card">
          <p>Order #101 - Wheat - ₹4000</p>
          <p>Status: Delivered</p>
        </div>

        <div className="card" style={{marginTop:"20px"}}>
          <p>Order #102 - Cotton - ₹6000</p>
          <p>Status: Pending</p>
        </div>
      </div>
    </div>
  );
}

export default MyOrders;