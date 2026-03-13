import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./farmer.css";

function FarmerDashboard() {
  return (
    <div className="farmer-layout">

      <Sidebar />

      <div className="dashboard-section">

        <Navbar />

        <div className="dashboard-content">
          <Outlet />
        </div>

      </div>

    </div>
  );
}

export default FarmerDashboard;