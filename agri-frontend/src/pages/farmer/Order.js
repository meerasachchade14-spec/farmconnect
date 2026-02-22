import React from "react";

const Order = () => {
  const orders = [
    { id: 1, product: "Tomato", quantity: 20 },
    { id: 2, product: "Onion", quantity: 15 },
  ];

  return (
    <div>
      <h2>Orders</h2>

      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            {o.product} — {o.quantity} kg
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Order;