import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div style={styles.card}>
      <img
        src={product.image}
        alt={product.name}
        style={styles.image}
      />

      <h3>{product.name}</h3>

      <p>Price: ₹{product.price} / kg</p>

      <p>Quantity: {product.quantity} kg</p>

      <button style={styles.button}>View Details</button>
    </div>
  );
};

const styles = {
  card: {
    width: "220px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center",
    background: "#f9f9f9",
  },
  image: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  button: {
    marginTop: "10px",
    background: "#2e7d32",
    color: "white",
    border: "none",
    padding: "8px",
    cursor: "pointer",
  },
};

export default ProductCard;