import React from "react";
import { Link } from "react-router-dom";
import "./buyer.css";

function BuyerProfile() {
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
          <h3>Profile</h3>
        </div>

        <div className="card">
          <p>Name: Buyer Name</p>
          <p>Email: buyer@gmail.com</p>
          <button className="button">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}

export default BuyerProfile;