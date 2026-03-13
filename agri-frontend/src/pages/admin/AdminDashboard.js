import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import "./admin.css";

function AdminDashboard() {
  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <AdminSidebar />

      <div className="dashboard-section">

        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <div className="dashboard-content">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;