import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./farmer.css";

const FarmerDashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="stats">
          <div className="card">
            <h3>Total Products</h3>
            <p>12</p>
          </div>

          <div className="card">
            <h3>Total Orders</h3>
            <p>8</p>
          </div>

          <div className="card">
            <h3>Total Earnings</h3>
            <p>₹ 12,500</p>
          </div>
        </div>

        <div className="welcome-box">
          <h2>Welcome to FarmConnect Portal 🌾</h2>
          <p>
            Manage your products, track orders and monitor earnings from one place.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;