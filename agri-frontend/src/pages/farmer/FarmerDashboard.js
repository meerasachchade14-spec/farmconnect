import React from "react";

const FarmerDashboard = () => {
  return (
    <div>
      <h2>Farmer Dashboard 🌾</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={styles.card}>Total Products: 12</div>
        <div style={styles.card}>Orders: 8</div>
        <div style={styles.card}>Earnings: ₹4500</div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "#e8f5e9",
    padding: "20px",
    borderRadius: "10px",
    fontWeight: "bold",
  },
};

export default FarmerDashboard;