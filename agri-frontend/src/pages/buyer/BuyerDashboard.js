import React from "react";
import { Link } from "react-router-dom";
import "./buyer.css";

function BuyerDashboard() {
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
          <h3>Buyer Dashboard</h3>
          <p>Welcome Buyer 👋</p>
        </div>

        <div className="cards">
          <div className="card">
            <h4>Available Crops</h4>
            <h2>24</h2>
          </div>
          <div className="card">
            <h4>Total Orders</h4>
            <h2>10</h2>
          </div>
          <div className="card">
            <h4>Total Spending</h4>
            <h2>₹65,000</h2>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BuyerDashboard;