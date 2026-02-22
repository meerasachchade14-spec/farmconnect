import React from "react";
import { Link } from "react-router-dom";

const FarmerSidebar = () => {
  return (
    <div style={styles.sidebar}>
      <h2>Farmer Panel</h2>

      <Link to="/farmer/dashboard">Dashboard</Link>
      <Link to="/farmer/add-product">Add Product</Link>
      <Link to="/farmer/products">My Products</Link>
      <Link to="/farmer/orders">Orders</Link>
      <Link to="/farmer/earnings">Earnings</Link>
      <Link to="/farmer/profile">Profile</Link>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#1b5e20",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
};

export default FarmerSidebar;