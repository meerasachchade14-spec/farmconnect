import React from "react";
import { Link } from "react-router-dom";
import "./buyer.css";

import wheat from "../../assests/crops/wheat.jpg";
import rice from "../../assests/crops/rice.jpg";
import cotton from "../../assests/crops/cotton.jpg";

function BrowseCrops() {
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
          <h3>Browse Crops</h3>
        </div>

        <div className="product-grid">
          <div className="product-card">
            <img src={wheat} alt="wheat"/>
            <h4>Wheat - ₹2000</h4>
            <button className="button">Add to Cart</button>
          </div>

          <div className="product-card">
            <img src={rice} alt="rice"/>
            <h4>Rice - ₹1800</h4>
            <button className="button">Add to Cart</button>
          </div>

          <div className="product-card">
            <img src={cotton} alt="cotton"/>
            <h4>Cotton - ₹6000</h4>
            <button className="button">Add to Cart</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BrowseCrops;