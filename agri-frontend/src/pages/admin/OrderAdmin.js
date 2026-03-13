import React from "react";
import "./OrderAdmin.css";

function OrderAdmin() {
  const orders = [
    { id: 101, buyer: "Rahul", farmer: "Amit", product: "Wheat", quantity: 50, status: "Delivered" },
    { id: 102, buyer: "Priya", farmer: "Rajesh", product: "Rice", quantity: 30, status: "Pending" },
    { id: 103, buyer: "Sonal", farmer: "Rahul", product: "Corn", quantity: 20, status: "Cancelled" },
  ];

  return (
    <div className="orders-container">
      <h2>All Orders</h2>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Buyer</th>
            <th>Farmer</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.buyer}</td>
              <td>{order.farmer}</td>
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td className={`order-status ${
                order.status === "Delivered"
                  ? "status-delivered"
                  : order.status === "Pending"
                  ? "status-pending"
                  : "status-cancel"
              }`}>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderAdmin;