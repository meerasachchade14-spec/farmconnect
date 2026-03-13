import React, { useState } from "react";
import "./Order.css";

function Order() {

  const [orders] = useState([
    {
      id: 1,
      product: "Wheat",
      buyer: "Virat Kohli",
      quantity: "50kg",
      price: "₹2000",
      location: "Mumbai, Maharashtra",
      payment: "Online",
      date: "10 March 2026",
      status: "Delivered"
    },
    {
      id: 2,
      product: "Rice",
      buyer: "M.S. Dhoni",
      quantity: "30kg",
      price: "₹1800",
      location: "Ranchi, Jharkhand",
      payment: "COD",
      date: "11 March 2026",
      status: "Pending"
    }
  ]);

  return (
    <div className="order-page">

      <h2 className="order-title">Orders</h2>

      {orders.length === 0 ? (

        <div className="no-orders">
          <h3>No Orders Yet</h3>
          <p>When buyers purchase your crops, orders will appear here.</p>
        </div>

      ) : (

        <div className="order-table">

          <table>

            <thead>
              <tr>
                <th>Product</th>
                <th>Buyer</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Location</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {orders.map((order) => (

                <tr key={order.id}>

                  <td>{order.product}</td>

                  <td>{order.buyer}</td>

                  <td>{order.quantity}</td>

                  <td>{order.price}</td>

                  <td>{order.location}</td>

                  <td>{order.payment}</td>

                  <td>{order.date}</td>

                  <td>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default Order;