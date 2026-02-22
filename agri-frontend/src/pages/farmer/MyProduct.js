import React from "react";

const MyProduct = () => {
  const products = [
    { id: 1, name: "Wheat", price: 25 },
    { id: 2, name: "Rice", price: 40 },
  ];

  return (
    <div>
      <h2>My Products</h2>

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} — ₹{p.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyProduct;