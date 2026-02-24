import React from "react";
import "./farmer.css";

function MyProduct() {
  const products = [
    { name: "Wheat", price: 25, image: "/images/wheat.jpg" },
    { name: "Rice", price: 30, image: "/images/rice.jpg" },
    { name: "Corn", price: 20, image: "/images/corn.jpg" },
    { name: "Cotton", price: 60, image: "/images/cotton.jpg" }
  ];

  return (
    <div className="main-content">
      <h2>My Crops</h2>
      <div className="product-grid">
        {products.map((item, index) => (
          <div className="product-card" key={index}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>₹ {item.price} /kg</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyProduct;