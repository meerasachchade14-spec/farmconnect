import React from "react";

const FarmerNavbar = () => {
  return (
    <div style={styles.navbar}>
      <h3>Farmer Dashboard</h3>
      <button style={styles.btn}>Logout</button>
    </div>
  );
};

const styles = {
  navbar: {
    background: "#2e7d32",
    color: "white",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
  },
  btn: {
    background: "white",
    color: "#2e7d32",
    border: "none",
    padding: "8px",
    cursor: "pointer",
  },
};

export default FarmerNavbar;